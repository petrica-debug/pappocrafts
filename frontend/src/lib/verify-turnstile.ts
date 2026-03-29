import type { NextRequest } from "next/server";

function messageForTurnstileErrorCodes(codes: string[] | undefined): string {
  if (!codes?.length) return "Security check failed. Please try again.";
  if (codes.includes("timeout-or-duplicate")) {
    return "Security check expired or was already used. Please complete it again.";
  }
  if (codes.includes("invalid-input-response") || codes.includes("missing-input-response")) {
    return "Security check was invalid. Please complete it again.";
  }
  if (codes.includes("invalid-input-secret") || codes.includes("missing-input-secret")) {
    return "Server configuration error.";
  }
  return "Security check failed. Please try again.";
}

/**
 * Verifies a Cloudflare Turnstile token from public listing forms.
 * Set `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to enforce.
 * If the secret is unset, verification is skipped (local dev).
 *
 * Note: We do not send `remoteip` to siteverify — wrong values behind proxies often cause false failures.
 */
export async function verifyTurnstileFromRequest(
  token: unknown,
  _request: NextRequest
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!secret) {
    if (siteKey && process.env.NODE_ENV === "production") {
      console.error("[turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY is set but TURNSTILE_SECRET_KEY is missing.");
      return { ok: false, error: "Server configuration error." };
    }
    return { ok: true };
  }

  const t = typeof token === "string" ? token.trim() : "";
  if (!t) {
    return { ok: false, error: "Please complete the security check." };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", t);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
  if (!data.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[turnstile] verify failed", data["error-codes"]);
    }
    return { ok: false, error: messageForTurnstileErrorCodes(data["error-codes"]) };
  }
  return { ok: true };
}
