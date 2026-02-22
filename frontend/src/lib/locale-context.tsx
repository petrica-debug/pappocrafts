"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { translations, type Locale, type TranslationKey } from "./translations";
import {
  getRegionForLocale,
  getShippingZoneForLocale,
  getRegionConfig,
  getShippingRate,
  getRegionalPrice,
  calculateShipping,
  type PricingRegion,
  type ShippingZone,
} from "./pricing";

export type CurrencyCode = "EUR" | "RSD" | "ALL" | "BAM" | "MKD" | "TRY";

interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
  currency: CurrencyCode;
  currencySymbol: string;
  exchangeRate: number;
}

export const locales: LocaleConfig[] = [
  { code: "en", name: "English", flag: "🇬🇧", currency: "EUR", currencySymbol: "€", exchangeRate: 1 },
  { code: "sr", name: "Srpski", flag: "🇷🇸", currency: "RSD", currencySymbol: "RSD", exchangeRate: 117.2 },
  { code: "sq", name: "Shqip", flag: "🇦🇱", currency: "ALL", currencySymbol: "L", exchangeRate: 100.5 },
  { code: "bs", name: "Bosanski", flag: "🇧🇦", currency: "BAM", currencySymbol: "KM", exchangeRate: 1.956 },
  { code: "mk", name: "Македонски", flag: "🇲🇰", currency: "MKD", currencySymbol: "ден", exchangeRate: 61.5 },
  { code: "cnr", name: "Crnogorski", flag: "🇲🇪", currency: "EUR", currencySymbol: "€", exchangeRate: 1 },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", currency: "TRY", currencySymbol: "₺", exchangeRate: 38.5 },
];

interface LocaleContextValue {
  locale: Locale;
  localeConfig: LocaleConfig;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  formatPrice: (eurPrice: number) => string;
  /** Applies regional multiplier then formats in local currency */
  formatRegionalPrice: (eurBasePrice: number) => string;
  /** Returns the regional EUR price (with multiplier applied) */
  getRegionalEurPrice: (eurBasePrice: number) => number;
  currency: CurrencyCode;
  currencySymbol: string;
  region: PricingRegion;
  shippingZone: ShippingZone;
  regionLabel: string;
  getShippingCost: (orderTotalEur: number, weightKg?: number) => { cost: number; isFree: boolean; freeAbove: number | null };
  shippingEstimate: string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const localeConfig = locales.find((l) => l.code === locale) || locales[0];
  const region = getRegionForLocale(locale);
  const shippingZone = getShippingZoneForLocale(locale);
  const regionConfig = getRegionConfig(region);
  const shippingRate = getShippingRate(shippingZone);

  const setLocale = useCallback((code: Locale) => {
    setLocaleState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("pappocrafts-locale", code);
      document.documentElement.lang = code === "cnr" ? "sr-ME" : code;
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale]?.[key] || translations.en[key] || key;
    },
    [locale]
  );

  const formatCurrency = useCallback(
    (eurAmount: number): string => {
      const converted = eurAmount * localeConfig.exchangeRate;
      if (localeConfig.currency === "EUR") {
        return `€${converted.toFixed(2)}`;
      }
      if (localeConfig.currency === "RSD" || localeConfig.currency === "ALL" || localeConfig.currency === "MKD") {
        return `${Math.round(converted).toLocaleString()} ${localeConfig.currencySymbol}`;
      }
      if (localeConfig.currency === "BAM") {
        return `${converted.toFixed(2)} ${localeConfig.currencySymbol}`;
      }
      if (localeConfig.currency === "TRY") {
        return `${localeConfig.currencySymbol}${converted.toFixed(2)}`;
      }
      return `${localeConfig.currencySymbol}${converted.toFixed(2)}`;
    },
    [localeConfig]
  );

  const formatPrice = formatCurrency;

  const getRegionalEurPrice = useCallback(
    (eurBasePrice: number): number => getRegionalPrice(eurBasePrice, region),
    [region]
  );

  const formatRegionalPrice = useCallback(
    (eurBasePrice: number): string => {
      const regionalEur = getRegionalPrice(eurBasePrice, region);
      return formatCurrency(regionalEur);
    },
    [region, formatCurrency]
  );

  const getShippingCost = useCallback(
    (orderTotalEur: number, weightKg: number = 1) =>
      calculateShipping(orderTotalEur, shippingZone, weightKg),
    [shippingZone]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      localeConfig,
      setLocale,
      t,
      formatPrice,
      formatRegionalPrice,
      getRegionalEurPrice,
      currency: localeConfig.currency,
      currencySymbol: localeConfig.currencySymbol,
      region,
      shippingZone,
      regionLabel: regionConfig.label,
      getShippingCost,
      shippingEstimate: shippingRate.estimatedDays,
    }),
    [locale, localeConfig, setLocale, t, formatPrice, formatRegionalPrice, getRegionalEurPrice, region, shippingZone, regionConfig, getShippingCost, shippingRate]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
