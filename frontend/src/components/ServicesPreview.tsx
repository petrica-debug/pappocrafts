"use client";

import Link from "next/link";
import { serviceCategories } from "@/lib/services";
import { useLocale } from "@/lib/locale-context";

export default function ServicesPreview() {
  const featured = serviceCategories.filter((c) => c.name !== "All");
  const { t } = useLocale();

  return (
    <section id="services" className="py-24 sm:py-32 bg-white">
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

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featured.map((cat) => (
            <Link
              key={cat.name}
              href={`/services?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-charcoal/5 bg-light/50 p-6 text-center hover:bg-white hover:border-green/20 hover:shadow-md transition-all"
            >
              <span className="text-4xl">{cat.icon}</span>
              <h3 className="text-sm font-semibold text-charcoal group-hover:text-green transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-charcoal/50">{cat.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full bg-blue px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue/25 hover:bg-blue-dark transition-all"
          >
            {t("svc.browseAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
