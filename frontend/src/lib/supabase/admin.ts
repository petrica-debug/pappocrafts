import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** PostgREST / Postgres “column missing” (migrations not applied on remote DB). */
export function isSupabaseMissingColumnError(error: { message?: string } | null, column: string): boolean {
  if (!error?.message) return false;
  const m = error.message.toLowerCase();
  const c = column.toLowerCase();
  if (!m.includes(c)) return false;
  return (
    m.includes("could not find") ||
    m.includes("does not exist") ||
    m.includes("schema cache") ||
    m.includes("undefined column")
  );
}

/** PostgREST PGRST204 / “column not in schema cache” — remote DB behind repo migrations. */
export function isPostgrestSchemaMismatch(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "PGRST204") return true;
  const m = (error.message || "").toLowerCase();
  return m.includes("schema cache") || m.includes("could not find the '");
}
