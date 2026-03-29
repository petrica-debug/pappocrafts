/**
 * Units of each currency per 1 EUR (ECB / Frankfurter style).
 * Must match `LocaleProvider` display conversion: eurAmount * rate = amount in that currency.
 */
export const UNITS_PER_ONE_EUR: Record<string, number> = {
  EUR: 1,
  RSD: 117.2,
  ALL: 100.5,
  BAM: 1.956,
  MKD: 61.5,
  TRY: 38.5,
};

const ALLOWED = new Set(Object.keys(UNITS_PER_ONE_EUR));

export function isListingCurrency(code: string): boolean {
  return ALLOWED.has(code.trim().toUpperCase());
}

/** Amount user entered in `currencyCode` → EUR for database storage. */
export function convertListedPriceToEur(amount: number, currencyCode: string): number {
  const c = currencyCode.trim().toUpperCase();
  if (!Number.isFinite(amount) || amount < 0) return 0;
  if (c === "EUR") return round2(amount);
  const unitsPerEur = UNITS_PER_ONE_EUR[c];
  if (!unitsPerEur || unitsPerEur <= 0) {
    throw new Error(`Unsupported currency: ${currencyCode}`);
  }
  return round2(amount / unitsPerEur);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
