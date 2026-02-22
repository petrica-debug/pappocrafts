const values = [
  {
    title: "Empowering Communities",
    description:
      "We create economic opportunities for Roma entrepreneurs, helping them turn traditional skills into sustainable businesses.",
  },
  {
    title: "Preserving Heritage",
    description:
      "Every product on PappoCrafts carries centuries of craft tradition. We help keep these living arts alive for future generations.",
  },
  {
    title: "Fair & Transparent",
    description:
      "Artisans set their own prices and receive fair compensation. We believe in trade that uplifts, not exploits.",
  },
  {
    title: "Bridging Cultures",
    description:
      "We connect Balkans makers with a global audience, fostering understanding and appreciation across borders.",
  },
];

export default function Mission() {
  return (
    <section id="mission" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          <div>
            <p className="text-sm font-semibold text-terracotta uppercase tracking-wide">
              Our Mission
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-walnut tracking-tight leading-tight">
              Building Bridges Through Craftsmanship
            </h2>
            <p className="mt-6 text-lg text-walnut/70 leading-relaxed">
              PappoCrafts was born from a simple belief: that the extraordinary
              craft traditions of Roma communities in the Western Balkans deserve
              a global stage. For too long, these skilled artisans have been
              underrepresented in the marketplace.
            </p>
            <p className="mt-4 text-lg text-walnut/70 leading-relaxed">
              We&apos;re changing that — one handmade piece at a time. Our platform
              connects talented Roma entrepreneurs from Albania, Serbia, Kosovo,
              North Macedonia, Bosnia, and Montenegro with customers who value
              authenticity, quality, and cultural heritage.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-cream bg-gradient-to-br from-terracotta to-olive flex items-center justify-center text-white text-xs font-bold"
                  >
                    {["A", "S", "K", "M"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-walnut/60">
                Artisans from across the Western Balkans
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <div
                key={value.title}
                className={`rounded-2xl p-6 ${
                  i % 2 === 0
                    ? "bg-terracotta/5 border border-terracotta/10"
                    : "bg-olive/5 border border-olive/10"
                }`}
              >
                <h3 className="font-semibold text-walnut">{value.title}</h3>
                <p className="mt-2 text-sm text-walnut/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
