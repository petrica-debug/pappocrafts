"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { categories } from "@/lib/products";
import { translateShopCategory } from "@/lib/translations";

const EMOJI: Record<string, string> = {
  "Pottery & Ceramics": "🏺",
  "Textiles & Weaving": "🧶",
  "Jewelry & Metalwork": "💍",
  "Woodwork & Carving": "🪵",
  "Leather Goods": "👜",
  "Traditional Clothing": "👗",
  "Handmade Accessories": "🎀",
  "Art & Paintings": "🖼️",
  "Home Decor": "🏡",
  Furniture: "🪑",
  "Food & Spices": "🫙",
  "Eco Products": "♻️",
  "Natural Products": "🌿",
  "Agricultural Products": "🌾",
  "Beauty & Personal Care": "✨",
  Machines: "⚙️",
  Electronics: "💻",
  Auto: "🚗",
};

export default function Categories() {
  const { t } = useLocale();
  const browse = categories.filter((c) => c !== "All");

  return (
    <section id="categories" className="bg-white pt-24 sm:pt-32 pb-10 sm:pb-14">
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

        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {browse.map((filterName) => (
            <Link
              key={filterName}
              href={`/?category=${encodeURIComponent(filterName)}`}
              className="group flex items-center gap-3 rounded-xl border border-charcoal/5 bg-light/50 px-4 py-3 hover:bg-white hover:border-green/20 hover:shadow-md transition-all"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-green/10 text-xl">
                {EMOJI[filterName] || "📦"}
              </span>
              <span className="text-sm font-semibold text-charcoal group-hover:text-green transition-colors leading-snug">
                {translateShopCategory(filterName, t)}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-green px-8 py-3 text-base font-semibold text-white shadow-lg shadow-green/25 hover:bg-green-dark transition-all"
          >
            {t("nav.browseProducts")}
          </Link>
        </div>
      </div>
    </section>
  );
}
