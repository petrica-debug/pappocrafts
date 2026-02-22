export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-walnut border-t border-walnut-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <span className="text-2xl font-serif font-bold text-cream tracking-tight">
              Pappo<span className="text-terracotta">Crafts</span>
            </span>
            <p className="mt-3 text-sm text-cream/50 leading-relaxed max-w-xs">
              Connecting Roma artisans in the Western Balkans with a global
              audience. Handmade, authentic, meaningful.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream/80 uppercase tracking-wide">
              Quick Links
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href="#how-it-works"
                className="text-sm text-cream/50 hover:text-terracotta transition-colors"
              >
                How It Works
              </a>
              <a
                href="#categories"
                className="text-sm text-cream/50 hover:text-terracotta transition-colors"
              >
                Categories
              </a>
              <a
                href="#mission"
                className="text-sm text-cream/50 hover:text-terracotta transition-colors"
              >
                Our Mission
              </a>
              <a
                href="#waitlist"
                className="text-sm text-cream/50 hover:text-terracotta transition-colors"
              >
                Join Waitlist
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream/80 uppercase tracking-wide">
              Countries We Serve
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Albania", "Serbia", "Kosovo", "N. Macedonia", "Bosnia", "Montenegro"].map(
                (country) => (
                  <span
                    key={country}
                    className="inline-block rounded-full bg-walnut-light px-3 py-1 text-xs text-cream/50"
                  >
                    {country}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-walnut-light pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40">
            &copy; {currentYear} PappoCrafts. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-cream/40 hover:text-cream/60 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-cream/40 hover:text-cream/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
