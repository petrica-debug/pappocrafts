"use client";

import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-walnut/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-walnut tracking-tight">
              Pappo<span className="text-terracotta">Crafts</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-walnut/70 hover:text-terracotta transition-colors"
            >
              How It Works
            </a>
            <a
              href="#categories"
              className="text-sm font-medium text-walnut/70 hover:text-terracotta transition-colors"
            >
              Categories
            </a>
            <a
              href="#mission"
              className="text-sm font-medium text-walnut/70 hover:text-terracotta transition-colors"
            >
              Our Mission
            </a>
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-terracotta-dark transition-colors"
            >
              Join Waitlist
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-walnut"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-walnut/10 bg-cream">
          <div className="flex flex-col gap-1 px-4 py-3">
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-walnut/70 hover:bg-cream-dark hover:text-terracotta transition-colors"
            >
              How It Works
            </a>
            <a
              href="#categories"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-walnut/70 hover:bg-cream-dark hover:text-terracotta transition-colors"
            >
              Categories
            </a>
            <a
              href="#mission"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-walnut/70 hover:bg-cream-dark hover:text-terracotta transition-colors"
            >
              Our Mission
            </a>
            <a
              href="#waitlist"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:bg-terracotta-dark transition-colors"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
