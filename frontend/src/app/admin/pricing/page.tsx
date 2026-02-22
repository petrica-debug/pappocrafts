"use client";

import { useState } from "react";
import Link from "next/link";
import {
  regionConfigs,
  shippingRates,
  getRegionalPrice,
  calculateShipping,
  calculateMargin,
  type PricingRegion,
  type ShippingZone,
} from "@/lib/pricing";
import { products } from "@/lib/products";

const ADMIN_CODE = "pappocrafts2026";

export default function AdminPricingPage() {
  const [authorized, setAuthorized] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  const [calcBasePrice, setCalcBasePrice] = useState(45);
  const [calcWeight, setCalcWeight] = useState(1);
  const [calcRegion, setCalcRegion] = useState<PricingRegion>("western_europe");
  const [calcZone, setCalcZone] = useState<ShippingZone>("eu");

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-charcoal/5 p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-2">Admin Access</h1>
          <p className="text-sm text-[#2D2D2D]/50 mb-6">Enter the admin code to view pricing dashboard.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (code === ADMIN_CODE) {
                setAuthorized(true);
                setCodeError(false);
              } else {
                setCodeError(true);
              }
            }}
          >
            <input
              type="password"
              value={code}
              onChange={(e) => { setCode(e.target.value); setCodeError(false); }}
              placeholder="Admin code"
              className="w-full rounded-lg border border-[#2D2D2D]/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9B3F] focus:border-transparent"
            />
            {codeError && <p className="text-sm text-red-500 mt-2">Invalid code.</p>}
            <button type="submit" className="mt-4 w-full rounded-full bg-[#4A9B3F] py-3 text-sm font-semibold text-white hover:bg-[#3D8234] transition-colors">
              Access Dashboard
            </button>
          </form>
          <Link href="/" className="block mt-4 text-center text-xs text-[#2D2D2D]/40 hover:text-[#2D2D2D]/60">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  const margin = calculateMargin(calcBasePrice, calcRegion, calcZone, calcWeight);
  const shipping = calculateShipping(margin.sellingPrice, calcZone, calcWeight);

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <nav className="bg-[#2D2D2D] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">PappoCrafts Admin</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">Pricing Dashboard</span>
          </div>
          <Link href="/" className="text-xs text-white/60 hover:text-white">Back to site</Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-8">Pricing & Shipping Dashboard</h1>

        {/* Regional Price Multipliers */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Regional Price Multipliers</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {regionConfigs.map((r) => (
              <div key={r.region} className="rounded-xl bg-white border border-[#2D2D2D]/5 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#2D2D2D]">{r.label}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    r.priceMultiplier < 1 ? "bg-blue-50 text-blue-600" : r.priceMultiplier > 1 ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {r.priceMultiplier < 1 ? `${((1 - r.priceMultiplier) * 100).toFixed(0)}% off` : r.priceMultiplier > 1 ? `+${((r.priceMultiplier - 1) * 100).toFixed(0)}%` : "Base price"}
                  </span>
                </div>
                <p className="text-xs text-[#2D2D2D]/50 mb-3">{r.description}</p>
                <div className="text-2xl font-bold text-[#2D2D2D]">&times;{r.priceMultiplier}</div>
                <p className="text-xs text-[#2D2D2D]/40 mt-1">
                  €45 product → €{(45 * r.priceMultiplier).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Rates Table */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Shipping Rate Table</h2>
          <div className="overflow-x-auto rounded-xl bg-white border border-[#2D2D2D]/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D2D]/5 bg-[#F8FAF8]">
                  <th className="px-5 py-3 text-left font-semibold text-[#2D2D2D]">Zone</th>
                  <th className="px-5 py-3 text-right font-semibold text-[#2D2D2D]">Base Cost</th>
                  <th className="px-5 py-3 text-right font-semibold text-[#2D2D2D]">Per Extra kg</th>
                  <th className="px-5 py-3 text-right font-semibold text-[#2D2D2D]">Free Above</th>
                  <th className="px-5 py-3 text-left font-semibold text-[#2D2D2D]">Est. Delivery</th>
                </tr>
              </thead>
              <tbody>
                {shippingRates.map((rate) => (
                  <tr key={rate.zone} className="border-b border-[#2D2D2D]/5 last:border-0">
                    <td className="px-5 py-3 font-medium text-[#2D2D2D]">{rate.label}</td>
                    <td className="px-5 py-3 text-right text-[#2D2D2D]/70">€{rate.baseCost.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right text-[#2D2D2D]/70">€{rate.perKgCost.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right">
                      {rate.freeAbove ? (
                        <span className="text-[#4A9B3F] font-medium">€{rate.freeAbove}</span>
                      ) : (
                        <span className="text-[#2D2D2D]/30">Never</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-[#2D2D2D]/50">{rate.estimatedDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Shipping & Margin Calculator */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Shipping & Margin Calculator</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white border border-[#2D2D2D]/5 p-6">
              <h3 className="font-semibold text-[#2D2D2D] mb-4">Input</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#2D2D2D]/60 mb-1">Base Price (EUR)</label>
                  <input
                    type="number"
                    min={1}
                    step={0.5}
                    value={calcBasePrice}
                    onChange={(e) => setCalcBasePrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#2D2D2D]/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2D2D2D]/60 mb-1">Package Weight (kg)</label>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#2D2D2D]/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2D2D2D]/60 mb-1">Pricing Region</label>
                  <select
                    value={calcRegion}
                    onChange={(e) => setCalcRegion(e.target.value as PricingRegion)}
                    className="w-full rounded-lg border border-[#2D2D2D]/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]"
                  >
                    {regionConfigs.map((r) => (
                      <option key={r.region} value={r.region}>{r.label} (×{r.priceMultiplier})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2D2D2D]/60 mb-1">Shipping Zone</label>
                  <select
                    value={calcZone}
                    onChange={(e) => setCalcZone(e.target.value as ShippingZone)}
                    className="w-full rounded-lg border border-[#2D2D2D]/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]"
                  >
                    {shippingRates.map((r) => (
                      <option key={r.zone} value={r.zone}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-[#2D2D2D]/5 p-6">
              <h3 className="font-semibold text-[#2D2D2D] mb-4">Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2D2D2D]/60">Base price (EUR)</span>
                  <span className="font-medium">€{calcBasePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2D2D2D]/60">Regional multiplier</span>
                  <span className="font-medium">×{regionConfigs.find((r) => r.region === calcRegion)!.priceMultiplier}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-[#2D2D2D]/10 pt-3">
                  <span className="font-semibold text-[#2D2D2D]">Selling Price</span>
                  <span className="font-bold text-[#4A9B3F]">€{margin.sellingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2D2D2D]/60">
                    Shipping cost ({calcWeight}kg)
                    {shipping.isFree && <span className="ml-1 text-[#4A9B3F]">(FREE)</span>}
                  </span>
                  <span className="font-medium">€{shipping.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-[#2D2D2D]/10 pt-3">
                  <span className="text-[#2D2D2D]/60">Platform fee (8%)</span>
                  <span className="font-medium text-[#4A90D9]">€{margin.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2D2D2D]/60">Artisan payout (92%)</span>
                  <span className="font-medium text-[#4A9B3F]">€{margin.artisanPayout.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-[#2D2D2D]/10 pt-3">
                  <span className="font-semibold text-[#2D2D2D]">Customer pays total</span>
                  <span className="text-lg font-bold text-[#2D2D2D]">€{(margin.sellingPrice + shipping.cost).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Comparison by Region */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">All Products — Price by Region</h2>
          <div className="overflow-x-auto rounded-xl bg-white border border-[#2D2D2D]/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D2D]/5 bg-[#F8FAF8]">
                  <th className="px-4 py-3 text-left font-semibold text-[#2D2D2D]">Product</th>
                  <th className="px-4 py-3 text-right font-semibold text-[#2D2D2D]">Base (EUR)</th>
                  {regionConfigs.map((r) => (
                    <th key={r.region} className="px-4 py-3 text-right font-semibold text-[#2D2D2D]">
                      {r.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold text-[#2D2D2D]">Platform 8%</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-[#2D2D2D]/5 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-[#2D2D2D] max-w-[200px] truncate">{p.name}</td>
                    <td className="px-4 py-2.5 text-right text-[#2D2D2D]/60">€{p.price.toFixed(2)}</td>
                    {regionConfigs.map((r) => {
                      const regional = getRegionalPrice(p.price, r.region);
                      return (
                        <td key={r.region} className={`px-4 py-2.5 text-right font-medium ${
                          r.priceMultiplier < 1 ? "text-[#4A90D9]" : r.priceMultiplier > 1 ? "text-[#4A9B3F]" : "text-[#2D2D2D]"
                        }`}>
                          €{regional.toFixed(2)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-2.5 text-right text-[#2D2D2D]/40">€{(p.price * 0.08).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
