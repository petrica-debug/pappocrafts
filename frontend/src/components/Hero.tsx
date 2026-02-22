export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="balkans-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0L60 30L30 60L0 30Z"
                fill="none"
                stroke="#4A3728"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#balkans-pattern)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 inline-block rounded-full bg-terracotta/10 px-4 py-1.5 text-sm font-semibold text-terracotta tracking-wide uppercase">
            Coming Soon
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-walnut leading-[1.1] tracking-tight">
            Handcrafted with
            <br />
            <span className="text-terracotta">Heart & Heritage</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-walnut/70 max-w-2xl mx-auto leading-relaxed">
            Discover unique handmade products crafted by Roma entrepreneurs
            across the Western Balkans. Every piece carries a story of tradition,
            skill, and cultural pride.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center rounded-full bg-terracotta px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-terracotta/25 hover:bg-terracotta-dark hover:shadow-terracotta/40 transition-all"
            >
              Join the Waitlist
            </a>
            <a
              href="#mission"
              className="inline-flex items-center justify-center rounded-full border-2 border-walnut/20 px-8 py-3.5 text-base font-semibold text-walnut hover:border-terracotta hover:text-terracotta transition-colors"
            >
              Learn Our Story
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <p className="font-serif text-3xl font-bold text-terracotta">6+</p>
              <p className="mt-1 text-sm text-walnut/60">Balkans Countries</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-terracotta">100+</p>
              <p className="mt-1 text-sm text-walnut/60">Artisan Sellers</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-terracotta">1000+</p>
              <p className="mt-1 text-sm text-walnut/60">Unique Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-walnut/40"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
          />
        </svg>
      </div>
    </section>
  );
}
