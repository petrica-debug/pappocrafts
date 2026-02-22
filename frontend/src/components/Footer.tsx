import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-charcoal-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/redi-logo.png" alt="REDI" width={32} height={32} className="h-8 w-auto" />
              <span className="text-xl font-serif font-bold text-white tracking-tight">
                Pappo<span className="text-green">Crafts</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-xs">
              Connecting Roma artisans in the Western Balkans with a global
              audience. Handmade, authentic, meaningful.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Shop</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/shop" className="text-sm text-white/50 hover:text-green transition-colors">All Products</Link>
              <Link href="/shop?category=Pottery+%26+Ceramics" className="text-sm text-white/50 hover:text-green transition-colors">Pottery & Ceramics</Link>
              <Link href="/shop?category=Textiles+%26+Weaving" className="text-sm text-white/50 hover:text-green transition-colors">Textiles & Weaving</Link>
              <Link href="/shop?category=Jewelry+%26+Metalwork" className="text-sm text-white/50 hover:text-green transition-colors">Jewelry & Metalwork</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Company</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/#how-it-works" className="text-sm text-white/50 hover:text-green transition-colors">How It Works</Link>
              <Link href="/#mission" className="text-sm text-white/50 hover:text-green transition-colors">Our Mission</Link>
              <Link href="/#categories" className="text-sm text-white/50 hover:text-green transition-colors">Categories</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Countries We Serve</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Albania", "Serbia", "Kosovo", "N. Macedonia", "Bosnia", "Montenegro"].map((country) => (
                <span key={country} className="inline-block rounded-full bg-charcoal-light px-3 py-1 text-xs text-white/50">
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-charcoal-light pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">&copy; {currentYear} PappoCrafts. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
