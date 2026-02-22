"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-charcoal/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/redi-logo.png" alt="REDI" width={40} height={40} className="h-9 w-auto" />
              <span className="text-xl font-serif font-bold text-charcoal tracking-tight">
                Pappo<span className="text-green">Crafts</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-charcoal/70 hover:text-green transition-colors">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-medium text-charcoal/70 hover:text-green transition-colors">
                Shop
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium text-charcoal/70 hover:text-green transition-colors">
                How It Works
              </Link>
              <Link href="/#mission" className="text-sm font-medium text-charcoal/70 hover:text-green transition-colors">
                Our Mission
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-charcoal/70 hover:text-green transition-colors"
                aria-label="Shopping cart"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-green px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-dark transition-colors"
              >
                Browse Products
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-charcoal"
                aria-label="Shopping cart"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-charcoal"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-charcoal/10 bg-white">
            <div className="flex flex-col gap-1 px-4 py-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal/70 hover:bg-light-dark hover:text-green transition-colors">
                Home
              </Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal/70 hover:bg-light-dark hover:text-green transition-colors">
                Shop
              </Link>
              <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal/70 hover:bg-light-dark hover:text-green transition-colors">
                How It Works
              </Link>
              <Link href="/#mission" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal/70 hover:bg-light-dark hover:text-green transition-colors">
                Our Mission
              </Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="mt-2 inline-flex items-center justify-center rounded-full bg-green px-5 py-2 text-sm font-semibold text-white hover:bg-green-dark transition-colors">
                Browse Products
              </Link>
            </div>
          </div>
        )}
      </nav>
      <CartSidebar />
    </>
  );
}
