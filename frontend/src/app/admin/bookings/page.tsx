"use client";

import { useEffect, useState } from "react";

type BookingRow = {
  id: string;
  created_at: string;
  status: string;
  provider_id: string;
  provider_name: string;
  provider_category: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  preferred_date: string | null;
  time_window_start: string | null;
  time_window_end: string | null;
  duration_hours: number | null;
  hourly_rate_eur: number | null;
  estimated_total_eur: number | null;
  message: string | null;
  locale: string | null;
};

export default function AdminBookingsPage() {
  const [entries, setEntries] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/admin/bookings", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data: { entries?: BookingRow[] }) => {
        setEntries(data.entries ?? []);
        setError(null);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setEntries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <h1 className="text-2xl font-bold text-white mb-1">Service booking requests</h1>
      <p className="text-sm text-white/45 mb-8">
        Submissions from the public booking form on service provider pages. Requests are not sent automatically to providers until you follow up.
      </p>

      {loading && <p className="text-white/40 text-sm">Loading…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <p className="text-white/40 text-sm">No booking requests yet.</p>
      )}

      <div className="space-y-4">
        {entries.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-white/10 bg-[#1A1D27] p-4 text-sm text-white/80"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="font-semibold text-white">{row.provider_name}</span>
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30">
                {row.status}
              </span>
            </div>
            <p className="text-xs text-white/45 mb-2">
              {new Date(row.created_at).toLocaleString()} · {row.provider_category || "—"} · {row.locale || "—"}
            </p>
            <p className="text-white/70">
              <strong className="text-white/90">Customer:</strong> {row.customer_name} ·{" "}
              <a href={`mailto:${row.customer_email}`} className="text-[#4A9B3F] hover:underline">
                {row.customer_email}
              </a>
              {row.customer_phone ? ` · ${row.customer_phone}` : ""}
            </p>
            <p className="mt-1 text-white/60">
              <strong className="text-white/80">When:</strong> {row.preferred_date || "—"}{" "}
              {row.time_window_start && row.time_window_end
                ? `${row.time_window_start}–${row.time_window_end}`
                : ""}
              {row.duration_hours != null ? ` (${row.duration_hours}h)` : ""}
            </p>
            {row.estimated_total_eur != null && (
              <p className="mt-1 text-[#4A9B3F] font-medium">
                Est. total: €{Number(row.estimated_total_eur).toFixed(2)}
                {row.hourly_rate_eur != null ? ` @ €${Number(row.hourly_rate_eur).toFixed(2)}/h` : ""}
              </p>
            )}
            {row.message && (
              <p className="mt-2 text-white/55 border-t border-white/5 pt-2 whitespace-pre-wrap">{row.message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
