import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

function toQueryString(sp: SearchParams): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((v) => q.append(key, v));
    else q.set(key, value);
  }
  return q.toString();
}

/** Legacy /shop URL → homepage listing at `/` (preserves query string). */
export default async function ShopListingRedirect({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const qs = toQueryString(sp);
  redirect(qs ? `/?${qs}` : "/");
}
