import { createAdminClient } from "@/lib/supabase/admin";

export async function addToWaitlist(
  email: string,
  role: "buyer" | "seller"
): Promise<{ success: boolean; message: string }> {
  const normalized = email.toLowerCase().trim();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error("[waitlist] missing Supabase env (URL or service role key)");
    throw new Error("Waitlist storage is not configured.");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("waitlist").insert({
    email: normalized,
    role,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "This email is already on the waitlist.",
      };
    }
    console.error("[waitlist] insert failed:", error.code, error.message);
    throw error;
  }

  return {
    success: true,
    message:
      "Welcome aboard! You'll be the first to know when PappoShop launches.",
  };
}
