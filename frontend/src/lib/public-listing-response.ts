/** Hide direct contact fields from public catalog JSON (phone is returned only via /api/public/reveal-contact). */
export function redactPublicListingContact(row: Record<string, unknown>): Record<string, unknown> {
  const o = { ...row };
  o.phone = "";
  o.submitter_phone = "";
  delete o.contact_reveal_count;
  return o;
}
