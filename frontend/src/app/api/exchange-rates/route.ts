import { NextResponse } from "next/server";

const SUPPORTED_CURRENCIES = ["USD", "GBP", "RSD", "ALL", "BAM", "MKD", "TRY", "CHF"] as const;

interface CachedRates {
  rates: Record<string, number>;
  fetchedAt: number;
}

let cache: CachedRates | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchLiveRates(): Promise<Record<string, number>> {
  const symbols = SUPPORTED_CURRENCIES.join(",");

  // Primary: Frankfurter API (ECB data, free, no key required)
  try {
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=EUR&symbols=${symbols}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.rates) return { EUR: 1, ...data.rates };
    }
  } catch {
    // fall through to fallback
  }

  // Fallback: Open Exchange Rates (exchangerate-api.com free tier)
  try {
    const res = await fetch(
      "https://open.er-api.com/v6/latest/EUR",
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        const filtered: Record<string, number> = { EUR: 1 };
        for (const code of SUPPORTED_CURRENCIES) {
          if (data.rates[code]) filtered[code] = data.rates[code];
        }
        return filtered;
      }
    }
  } catch {
    // fall through to hardcoded
  }

  return FALLBACK_RATES;
}

const FALLBACK_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
  RSD: 117.2,
  ALL: 100.5,
  BAM: 1.956,
  MKD: 61.5,
  TRY: 38.5,
  CHF: 0.97,
};

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.fetchedAt < CACHE_TTL) {
    return NextResponse.json(
      { rates: cache.rates, source: "cached", updated_at: new Date(cache.fetchedAt).toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  }

  const rates = await fetchLiveRates();
  const isLive = rates !== FALLBACK_RATES;

  cache = { rates, fetchedAt: now };

  return NextResponse.json(
    { rates, source: isLive ? "live" : "fallback", updated_at: new Date(now).toISOString() },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
  );
}
