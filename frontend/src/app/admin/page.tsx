"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalOrders: number;
  todayOrders: number;
  monthlyOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  avgOrderValue: number;
  paidCount: number;
  pendingPaymentCount: number;
  statusCounts: Record<string, number>;
  countryCounts: Record<string, number>;
  payOnlineCount: number;
  payLaterCount: number;
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="rounded-xl bg-[#1A1D27] border border-white/5 p-5">
      <p className="text-xs font-medium text-white/40">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) return;
    fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const s = stats;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Overview of your PappoCrafts platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Total Orders" value={s ? String(s.totalOrders) : "—"} sub={s ? `${s.todayOrders} today` : undefined} color="text-white" />
        <StatCard label="Total Revenue" value={s ? `€${s.totalRevenue.toFixed(2)}` : "—"} sub={s ? `€${s.monthlyRevenue.toFixed(2)} this month` : undefined} color="text-[#4A9B3F]" />
        <StatCard label="Avg Order Value" value={s ? `€${s.avgOrderValue.toFixed(2)}` : "—"} color="text-[#4A90D9]" />
        <StatCard label="Pending Payments" value={s ? String(s.pendingPaymentCount) : "—"} sub={s ? `${s.paidCount} paid` : undefined} color="text-[#E67E22]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Order Status */}
        <div className="rounded-xl bg-[#1A1D27] border border-white/5 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Order Status</h2>
          {s && Object.keys(s.statusCounts).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(s.statusCounts).map(([status, count]) => {
                const colors: Record<string, string> = {
                  pending: "bg-yellow-500", confirmed: "bg-blue-500", processing: "bg-purple-500",
                  shipped: "bg-cyan-500", delivered: "bg-green-500", cancelled: "bg-red-500",
                };
                const pct = s.totalOrders > 0 ? (count / s.totalOrders) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60 capitalize">{status}</span>
                      <span className="text-white/40">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <div className={`h-full rounded-full ${colors[status] || "bg-gray-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-white/20">No orders yet. Place an order to see stats here.</p>
          )}
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl bg-[#1A1D27] border border-white/5 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Payment Methods</h2>
          {s && s.totalOrders > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#4A9B3F]/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-[#4A9B3F]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Online (Stripe)</p>
                  <p className="text-xs text-white/30">{s.payOnlineCount} orders</p>
                </div>
                <span className="text-lg font-bold text-white">{s.totalOrders > 0 ? Math.round((s.payOnlineCount / s.totalOrders) * 100) : 0}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#E67E22]/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-[#E67E22]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Pay Later</p>
                  <p className="text-xs text-white/30">{s.payLaterCount} orders</p>
                </div>
                <span className="text-lg font-bold text-white">{s.totalOrders > 0 ? Math.round((s.payLaterCount / s.totalOrders) * 100) : 0}%</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/20">No payment data yet.</p>
          )}
        </div>
      </div>

      {/* Customer Regions */}
      {s && Object.keys(s.countryCounts).length > 0 && (
        <div className="rounded-xl bg-[#1A1D27] border border-white/5 p-5 mb-8">
          <h2 className="text-sm font-semibold text-white mb-4">Customers by Country</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(s.countryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([country, count]) => (
                <span key={country} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                  {country} <span className="font-bold text-white">{count}</span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/orders" className="rounded-xl bg-[#1A1D27] border border-white/5 p-5 hover:border-[#4A9B3F]/30 transition-colors group">
          <h3 className="text-sm font-semibold text-white group-hover:text-[#4A9B3F] transition-colors">Manage Orders</h3>
          <p className="text-xs text-white/30 mt-1">View, update status, and manage all orders</p>
        </Link>
        <Link href="/admin/products" className="rounded-xl bg-[#1A1D27] border border-white/5 p-5 hover:border-[#4A9B3F]/30 transition-colors group">
          <h3 className="text-sm font-semibold text-white group-hover:text-[#4A9B3F] transition-colors">Manage Products</h3>
          <p className="text-xs text-white/30 mt-1">Add, edit, or remove products from the shop</p>
        </Link>
        <Link href="/admin/services" className="rounded-xl bg-[#1A1D27] border border-white/5 p-5 hover:border-[#4A9B3F]/30 transition-colors group">
          <h3 className="text-sm font-semibold text-white group-hover:text-[#4A9B3F] transition-colors">Manage Services</h3>
          <p className="text-xs text-white/30 mt-1">Add, edit, or remove service providers</p>
        </Link>
      </div>
    </div>
  );
}
