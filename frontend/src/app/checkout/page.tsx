"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { useLocale } from "@/lib/locale-context";

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { t, formatPrice, formatRegionalPrice, getRegionalEurPrice, getShippingCost, shippingEstimate, regionLabel } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const regionalTotal = items.reduce(
    (sum, item) => sum + getRegionalEurPrice(item.product.price) * item.quantity,
    0
  );
  const shipping = getShippingCost(regionalTotal);
  const grandTotal = regionalTotal + shipping.cost;

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
            price: getRegionalEurPrice(item.product.price),
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
            {t("checkout.title")}
          </h1>
          <p className="text-charcoal/60 mb-8">{t("checkout.review")}</p>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-charcoal/5">
              <svg className="h-16 w-16 text-charcoal/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-charcoal/50 mb-4">{t("checkout.emptyCart")}</p>
              <Link href="/shop" className="inline-flex rounded-full bg-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-dark transition-colors">
                {t("checkout.browseProducts")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 bg-white rounded-2xl border border-charcoal/5 p-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-light">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="96px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.product.id}`}>
                        <h3 className="font-semibold text-charcoal hover:text-green transition-colors">{item.product.name}</h3>
                      </Link>
                      <p className="text-xs text-charcoal/50 mt-0.5">{t("shop.by")} {item.product.artisan} &middot; {item.product.country}</p>
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
                            {t("checkout.remove")}
                          </button>
                        </div>
                        <p className="text-lg font-bold text-green">{formatRegionalPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-charcoal/5 p-6 h-fit sticky top-24">
                <h2 className="font-semibold text-charcoal mb-1">{t("checkout.title")}</h2>
                <p className="text-xs text-charcoal/40 mb-4">
                  Shipping to: {regionLabel}
                </p>

                <div className="space-y-3 border-b border-charcoal/10 pb-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">{t("checkout.subtotal")}</span>
                    <span className="text-charcoal">{formatPrice(regionalTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">{t("checkout.shipping")}</span>
                    <span className="text-green font-medium">
                      {shipping.isFree ? t("checkout.shippingFree") : formatPrice(shipping.cost)}
                    </span>
                  </div>
                  {!shipping.isFree && shipping.freeAbove !== null && (
                    <p className="text-xs text-charcoal/40">
                      Free shipping on orders over {formatPrice(shipping.freeAbove)}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-charcoal/40">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25m-2.25 0h-2.25m0 0v6.75m0-6.75H5.625" />
                    </svg>
                    Est. {shippingEstimate}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-charcoal">{t("checkout.total")}</span>
                  <span className="text-2xl font-bold text-charcoal">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full rounded-full bg-green py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-green/25 hover:bg-green-dark disabled:opacity-50 transition-all"
                >
                  {loading ? t("checkout.redirecting") : t("checkout.payStripe")}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-charcoal/40">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  {t("checkout.secure")}
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
