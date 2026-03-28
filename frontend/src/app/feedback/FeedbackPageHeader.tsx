"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

export function FeedbackPageHeader() {
  const { t } = useLocale();
  return (
    <>
      <Link href="/" className="text-sm text-charcoal/50 hover:text-green transition-colors">
        &larr; {t("nav.home")}
      </Link>
      <h1 className="mt-6 font-serif text-3xl font-bold text-charcoal tracking-tight">{t("feedback.title")}</h1>
      <p className="mt-2 text-sm text-charcoal/60 leading-relaxed">{t("feedback.intro")}</p>
    </>
  );
}
