"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string;
  customer: { name: string; email: string; phone: string; country: string };
  total: number;
  paymentMethod: "online" | "later";
  paymentStatus: "pending" | "paid" | "refunded";
  status: string;
  createdAt: string;
}

export default function AdminPayments() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "paid" | "refunded">("all");

  const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setOrders(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  async function markPaid(id: string) {
    if (!token) return;
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, paymentStatus: "paid" }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus: "paid" as const } : o)));
    }
  }

  async function markRefunded(id: string) {
    if (!token) return;
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, paymentStatus: "refunded" }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus: "refunded" as const } : o)));
    }
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.paymentStatus === filter);
  const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  const pendingAmount = orders.filter((o) => o.paymentStatus === "pending" && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const refundedAmount = orders.filter((o) => o.paymentStatus === "refunded").reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-sm text-white/40 mt-1">Track and manage all payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl bg-[#1A1D27] border border-white/5 p-5">
          <p className="text-xs font-medium text-white/40">Collected</p>
          <p className="text-2xl font-bold text-[#4A9B3F] mt-1">&euro;{totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-white/20 mt-1">{orders.filter((o) => o.paymentStatus === "paid").length} paid orders</p>
        </div>
        <div className="rounded-xl bg-[#1A1D27] border border-white/5 p-5">
          <p className="text-xs font-medium text-white/40">Pending</p>
          <p className="text-2xl font-bold text-[#E67E22] mt-1">&euro;{pendingAmount.toFixed(2)}</p>
          <p className="text-xs text-white/20 mt-1">{orders.filter((o) => o.paymentStatus === "pending" && o.status !== "cancelled").length} awaiting payment</p>
        </div>
        <div className="rounded-xl bg-[#1A1D27] border border-white/5 p-5">
          <p className="text-xs font-medium text-white/40">Refunded</p>
          <p className="text-2xl font-bold text-red-400 mt-1">&euro;{refundedAmount.toFixed(2)}</p>
          <p className="text-xs text-white/20 mt-1">{orders.filter((o) => o.paymentStatus === "refunded").length} refunded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "paid", "refunded"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-[#4A9B3F] text-white" : "bg-white/5 text-white/40 hover:text-white/60"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading payments...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-[#1A1D27] border border-white/5 p-12 text-center">
          <p className="text-white/30 text-sm">No payments found.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-[#1A1D27] border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40">Method</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white/40">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-white">{order.id}</span>
                    <p className="text-[10px] text-white/20">{new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-white">{order.customer.name}</p>
                    <p className="text-[10px] text-white/30">{order.customer.country}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${order.paymentMethod === "online" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"}`}>
                      {order.paymentMethod === "online" ? "Card" : "Pay Later"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">&euro;{order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                      order.paymentStatus === "paid" ? "bg-green-500/10 text-green-400" : order.paymentStatus === "refunded" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {order.paymentStatus === "pending" && (
                        <button onClick={() => markPaid(order.id)} className="rounded bg-green-500/10 px-2 py-1 text-[10px] text-green-400 hover:bg-green-500/20">Mark Paid</button>
                      )}
                      {order.paymentStatus === "paid" && (
                        <button onClick={() => markRefunded(order.id)} className="rounded bg-red-500/10 px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/20">Refund</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
