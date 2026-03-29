"use client";

import Link from "next/link";
import { serviceCategories } from "@/lib/services";
import { useLocale } from "@/lib/locale-context";
import { translateServiceCategory } from "@/lib/translations";

export default function ServicesPreview() {
  const featured = serviceCategories.filter((c) => c.name !== "All");
  const { t } = useLocale();

  return (
    <section id="services" className="bg-white pt-10 sm:pt-14 pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-blue uppercase tracking-wide">
            {t("svc.badge")}
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
            {t("svc.title")}
          </h2>
          <p className="mt-4 text-lg text-charcoal/60 leading-relaxed">
            {t("svc.desc")}
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {featured.map((cat) => (
            <Link
              key={cat.name}
              href={`/services?category=${encodeURIComponent(cat.name)}`}
              className="group flex items-center gap-3 rounded-xl border border-charcoal/5 bg-light/50 px-4 py-3 hover:bg-white hover:border-green/20 hover:shadow-md transition-all"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-green/10 text-xl">
                {cat.icon}
              </span>
              <span className="min-w-0 flex flex-col gap-0.5 text-left">
                <span className="text-sm font-semibold text-charcoal group-hover:text-green transition-colors leading-snug">
                  {translateServiceCategory(cat.name, t)}
                </span>
                <span className="text-xs text-charcoal/50 line-clamp-2 leading-snug">{cat.description}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full bg-green px-8 py-3 text-base font-semibold text-white shadow-lg shadow-green/25 hover:bg-green-dark transition-all"
          >
            {t("svc.browseAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
