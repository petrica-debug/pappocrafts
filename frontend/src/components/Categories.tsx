"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import type { TranslationKey } from "@/lib/translations";

const categories: { nameKey: TranslationKey; descKey: TranslationKey; filterName: string; emoji: string; accent: string }[] = [
  { nameKey: "cat.pottery", descKey: "cat.potteryDesc", filterName: "Pottery & Ceramics", emoji: "🏺", accent: "bg-green/10" },
  { nameKey: "cat.textiles", descKey: "cat.textilesDesc", filterName: "Textiles & Weaving", emoji: "🧶", accent: "bg-blue/10" },
  { nameKey: "cat.jewelry", descKey: "cat.jewelryDesc", filterName: "Jewelry & Metalwork", emoji: "💍", accent: "bg-green/10" },
  { nameKey: "cat.woodwork", descKey: "cat.woodworkDesc", filterName: "Woodwork & Carving", emoji: "🪵", accent: "bg-blue/10" },
  { nameKey: "cat.leather", descKey: "cat.leatherDesc", filterName: "Leather Goods", emoji: "👜", accent: "bg-green/10" },
  { nameKey: "cat.food", descKey: "cat.foodDesc", filterName: "Food & Spices", emoji: "🫙", accent: "bg-blue/10" },
];

export default function Categories() {
  const { t } = useLocale();

  return (
    <section id="categories" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-blue uppercase tracking-wide">
            {t("cat.badge")}
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
            {t("cat.title")}
          </h2>
          <p className="mt-4 text-lg text-charcoal/60 leading-relaxed">
            {t("cat.desc")}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.filterName}
              href={`/shop?category=${encodeURIComponent(cat.filterName)}`}
              className="group relative rounded-2xl border border-charcoal/5 bg-light/50 p-6 hover:bg-white hover:border-green/20 hover:shadow-md transition-all"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${cat.accent}`}>
                {cat.emoji}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal group-hover:text-green transition-colors">
                {t(cat.nameKey)}
              </h3>
              <p className="mt-2 text-sm text-charcoal/60 leading-relaxed">{t(cat.descKey)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
