"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
          })),
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout session.");
        setLoading(false);
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-2">
            Checkout
          </h1>
          <p className="text-charcoal/60 mb-8">Review your items before payment.</p>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-charcoal/5">
              <svg className="h-16 w-16 text-charcoal/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-charcoal/50 mb-4">Your cart is empty</p>
              <Link href="/shop" className="inline-flex rounded-full bg-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-dark transition-colors">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 bg-white rounded-2xl border border-charcoal/5 p-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-light">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.product.id}`}>
                        <h3 className="font-semibold text-charcoal hover:text-green transition-colors">{item.product.name}</h3>
                      </Link>
                      <p className="text-xs text-charcoal/50 mt-0.5">by {item.product.artisan} &middot; {item.product.country}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-8 w-8 rounded-lg border border-charcoal/10 flex items-center justify-center text-charcoal/60 hover:border-green hover:text-green transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium text-charcoal w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-8 w-8 rounded-lg border border-charcoal/10 flex items-center justify-center text-charcoal/60 hover:border-green hover:text-green transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-3 text-xs text-charcoal/40 hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-lg font-bold text-green">&euro;{(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="bg-white rounded-2xl border border-charcoal/5 p-6 h-fit sticky top-24">
                <h2 className="font-semibold text-charcoal mb-4">Order Summary</h2>
                <div className="space-y-3 border-b border-charcoal/10 pb-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">Subtotal</span>
                    <span className="text-charcoal">&euro;{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">Shipping</span>
                    <span className="text-green font-medium">{totalPrice >= 75 ? "Free" : "€5.00"}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="text-2xl font-bold text-charcoal">
                    &euro;{(totalPrice + (totalPrice >= 75 ? 0 : 5)).toFixed(2)}
                  </span>
                </div>

                {error && (
                  <p className="text-sm text-red-500 mb-4">{error}</p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full rounded-full bg-green py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-green/25 hover:bg-green-dark disabled:opacity-50 transition-all"
                >
                  {loading ? "Redirecting to payment..." : "Pay with Stripe"}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-charcoal/40">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  Secure payment powered by Stripe
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
