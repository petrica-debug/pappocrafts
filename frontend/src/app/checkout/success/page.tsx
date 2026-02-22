"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center py-24">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
            <svg className="h-10 w-10 text-green" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
            Thank You!
          </h1>
          <p className="mt-4 text-lg text-charcoal/60 leading-relaxed">
            Your order has been placed successfully. You&apos;ll receive a confirmation email
            shortly with your order details and tracking information.
          </p>
          <p className="mt-4 text-charcoal/60">
            Your purchase directly supports Roma artisans in the Western Balkans.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-green px-8 py-3 text-base font-semibold text-white shadow-lg shadow-green/25 hover:bg-green-dark transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border-2 border-charcoal/20 px-8 py-3 text-base font-semibold text-charcoal hover:border-green hover:text-green transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
