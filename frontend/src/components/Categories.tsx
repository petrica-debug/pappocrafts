const categories = [
  {
    name: "Pottery & Ceramics",
    description: "Hand-thrown bowls, vases, and decorative pieces shaped by generations of tradition.",
    emoji: "🏺",
    color: "bg-terracotta/10 text-terracotta",
  },
  {
    name: "Textiles & Weaving",
    description: "Handwoven rugs, embroidered linens, and traditional Balkans textile art.",
    emoji: "🧶",
    color: "bg-olive/10 text-olive",
  },
  {
    name: "Jewelry & Metalwork",
    description: "Intricately crafted silver, copper, and brass pieces with Roma motifs.",
    emoji: "💍",
    color: "bg-terracotta/10 text-terracotta",
  },
  {
    name: "Woodwork & Carving",
    description: "Hand-carved instruments, utensils, and decorative art from native Balkans woods.",
    emoji: "🪵",
    color: "bg-olive/10 text-olive",
  },
  {
    name: "Leather Goods",
    description: "Handstitched bags, belts, and accessories using traditional tanning methods.",
    emoji: "👜",
    color: "bg-terracotta/10 text-terracotta",
  },
  {
    name: "Food & Spices",
    description: "Traditional preserves, spice blends, and artisanal food products from the Balkans.",
    emoji: "🫙",
    color: "bg-olive/10 text-olive",
  },
];

export default function Categories() {
  return (
    <section id="categories" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-olive uppercase tracking-wide">
            What You&apos;ll Find
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-walnut tracking-tight">
            Explore Our Categories
          </h2>
          <p className="mt-4 text-lg text-walnut/60 leading-relaxed">
            From ancient pottery techniques to vibrant textiles — discover the rich
            craft traditions of the Western Balkans.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group relative rounded-2xl border border-walnut/5 bg-cream/50 p-6 hover:bg-cream hover:border-olive/20 hover:shadow-sm transition-all cursor-pointer"
            >
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${cat.color}`}
              >
                {cat.emoji}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-walnut group-hover:text-olive transition-colors">
                {cat.name}
              </h3>
              <p className="mt-2 text-sm text-walnut/60 leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
