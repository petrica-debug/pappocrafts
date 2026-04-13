/** Legacy fallback kept empty to avoid defaulting to a hardcoded number. */
export const DEFAULT_LISTING_PHONE = "";

export function normalizeListingPhone(raw: unknown): string {
  return String(raw ?? "").trim();
}

/** Minimum length after trim (allows short local formats; blocks empty). */
export function isValidListingPhone(phone: string): boolean {
  const t = phone.trim();
  return t.length >= 6;
}
