"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { translations, type Locale, type TranslationKey } from "./translations";

export type CurrencyCode = "EUR" | "RSD" | "ALL" | "BAM" | "MKD" | "TRY";

interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
  currency: CurrencyCode;
  currencySymbol: string;
  exchangeRate: number; // from EUR
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
  currency: CurrencyCode;
  currencySymbol: string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const localeConfig = locales.find((l) => l.code === locale) || locales[0];

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

  const formatPrice = useCallback(
    (eurPrice: number): string => {
      const converted = eurPrice * localeConfig.exchangeRate;
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

  return (
    <LocaleContext.Provider
      value={{
        locale,
        localeConfig,
        setLocale,
        t,
        formatPrice,
        currency: localeConfig.currency,
        currencySymbol: localeConfig.currencySymbol,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
