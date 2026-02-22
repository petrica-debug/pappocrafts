"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocale } from "@/lib/locale-context";

export default function CheckoutCancel() {
  const { t } = useLocale();

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center py-24">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-charcoal/10">
            <svg className="h-10 w-10 text-charcoal/50" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
            {t("cancel.title")}
          </h1>
          <p className="mt-4 text-lg text-charcoal/60 leading-relaxed">
            {t("cancel.desc")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-full bg-green px-8 py-3 text-base font-semibold text-white shadow-lg shadow-green/25 hover:bg-green-dark transition-all"
            >
              {t("cancel.returnCheckout")}
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border-2 border-charcoal/20 px-8 py-3 text-base font-semibold text-charcoal hover:border-green hover:text-green transition-colors"
            >
              {t("cancel.keepShopping")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
