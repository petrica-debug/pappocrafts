"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string;
  customer: { name: string; email: string; phone: string; city: string; country: string };
  items: { name: string; price: number; quantity: number }[];
  total: number;
  paymentMethod: "online" | "later";
  paymentStatus: "pending" | "paid" | "refunded";
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  processing: "bg-purple-500/10 text-purple-400",
  shipped: "bg-cyan-500/10 text-cyan-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};
const PAY_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  paid: "bg-green-500/10 text-green-400",
  refunded: "bg-red-500/10 text-red-400",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState("all");

  const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setOrders(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  async function updateStatus(id: string, status: string) {
    if (!token) return;
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      if (selected?.id === id) setSelected(updated);
    }
  }

  async function updatePayment(id: string, paymentStatus: string) {
    if (!token) return;
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, paymentStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      if (selected?.id === id) setSelected(updated);
    }
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-sm text-white/40 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === s ? "bg-[#4A9B3F] text-white" : "bg-white/5 text-white/40 hover:text-white/60"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== "all" && ` (${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-[#1A1D27] border border-white/5 p-12 text-center">
          <p className="text-white/30 text-sm">No orders found. Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelected(selected?.id === order.id ? null : order)}
              className={`rounded-xl bg-[#1A1D27] border p-4 cursor-pointer transition-colors ${
                selected?.id === order.id ? "border-[#4A9B3F]/40" : "border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-white">{order.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[order.status] || ""}`}>
                      {order.status}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${PAY_COLORS[order.paymentStatus] || ""}`}>
                      {order.paymentStatus}
                    </span>
                    {order.paymentMethod === "later" && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-orange-500/10 text-orange-400">Pay Later</span>
                    )}
                  </div>
                  <p className="text-sm text-white/60 mt-1">
                    {order.customer.name} &middot; {order.customer.city}, {order.customer.country}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">&euro;{order.total.toFixed(2)}</p>
                    <p className="text-[10px] text-white/30">{new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {selected?.id === order.id && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="grid gap-4 sm:grid-cols-2 mb-4">
                    <div>
                      <h4 className="text-xs font-semibold text-white/40 mb-2">Contact</h4>
                      <p className="text-sm text-white">{order.customer.name}</p>
                      <a href={`mailto:${order.customer.email}`} className="text-xs text-[#4A9B3F] hover:underline">{order.customer.email}</a>
                      <br />
                      <a href={`tel:${order.customer.phone}`} className="text-xs text-[#4A9B3F] hover:underline">{order.customer.phone}</a>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white/40 mb-2">Items ({order.items.length})</h4>
                      {order.items.map((item, i) => (
                        <p key={i} className="text-xs text-white/60">
                          {item.quantity}x {item.name} — &euro;{(item.price * item.quantity).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div>
                      <label className="block text-[10px] text-white/30 mb-1">Update Status</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="rounded-lg border border-white/10 bg-white/5 text-white text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-[#1A1D27]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/30 mb-1">Payment Status</label>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePayment(order.id, e.target.value)}
                        className="rounded-lg border border-white/10 bg-white/5 text-white text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]"
                      >
                        {["pending", "paid", "refunded"].map((s) => (
                          <option key={s} value={s} className="bg-[#1A1D27]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
