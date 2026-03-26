"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const COUNTRIES = ["North Macedonia", "Serbia", "Albania"] as const;

type WaitlistStatus =
  | "pending"
  | "buyer_created"
  | "product_seller_created"
  | "service_provider_created"
  | "dismissed";

type LinkedUser = { id: string; email: string; name: string; role: string };

type WaitlistRow = {
  id: number;
  email: string;
  role: string | null;
  created_at: string;
  status?: WaitlistStatus;
  linked_admin_user_id?: string | null;
  linked_user?: LinkedUser | null;
};

type ProvisionAction = "create_buyer" | "create_product_seller" | "create_service_provider";

function normalizeStatus(s: string | undefined): WaitlistStatus {
  if (
    s === "buyer_created" ||
    s === "product_seller_created" ||
    s === "service_provider_created" ||
    s === "dismissed"
  ) {
    return s;
  }
  return "pending";
}

function csvEscape(value: string) {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadCsv(rows: WaitlistRow[], filename: string) {
  const header = "email,signup_role,status,signed_up_at";
  const lines = rows.map((r) => {
    const signupRole = r.role === "seller" ? "seller" : "buyer";
    return [csvEscape(r.email), signupRole, csvEscape(normalizeStatus(r.status)), csvEscape(r.created_at)].join(",");
  });
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_LABELS: Record<WaitlistStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "border-amber-500/30 bg-amber-500/10 text-amber-200" },
  buyer_created: { label: "Buyer account", className: "border-green-500/30 bg-green-500/10 text-green-200" },
  product_seller_created: {
    label: "Product seller",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  },
  service_provider_created: {
    label: "Service provider",
    className: "border-violet-500/30 bg-violet-500/15 text-violet-200",
  },
  dismissed: { label: "Dismissed", className: "border-white/15 bg-white/5 text-white/45" },
};

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "buyer" | "seller">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "done" | "dismissed">("all");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [provision, setProvision] = useState<{
    row: WaitlistRow;
    action: ProvisionAction;
  } | null>(null);
  const [provisionSubmitting, setProvisionSubmitting] = useState(false);
  const [provisionError, setProvisionError] = useState("");
  const [formName, setFormName] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formBusiness, setFormBusiness] = useState("");
  const [formCountry, setFormCountry] = useState<(typeof COUNTRIES)[number]>("North Macedonia");
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [servicesLink, setServicesLink] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams();
    if (roleFilter !== "all") params.set("role", roleFilter);
    if (statusFilter !== "all") params.set("status", statusFilter === "done" ? "done" : statusFilter);
    const qs = params.toString() ? `?${params.toString()}` : "";
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/waitlist${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setEntries(data.entries ?? []);
      setLoadError(null);
    } catch (e) {
      console.error("[Waitlist] Fetch error:", e);
      setLoadError(e instanceof Error ? e.message : "Failed to load");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!provision) return;
    setFormName("");
    setFormPassword("");
    setFormBusiness("");
    setFormCountry("North Macedonia");
    setProvisionError("");
  }, [provision]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.email.toLowerCase().includes(q));
  }, [entries, search]);

  const stats = useMemo(() => {
    const buyers = entries.filter((e) => (e.role ?? "buyer") === "buyer").length;
    const sellers = entries.filter((e) => e.role === "seller").length;
    const pending = entries.filter((e) => normalizeStatus(e.status) === "pending").length;
    return { total: entries.length, buyers, sellers, pending };
  }, [entries]);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function handleDelete(id: number) {
    if (!window.confirm("Remove this row from the waitlist? (The account, if any, is not deleted.)")) return;
    const token = localStorage.getItem("admin-token");
    if (!token) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/waitlist?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDismiss(row: WaitlistRow) {
    if (!window.confirm(`Dismiss ${row.email} without creating an account?`)) return;
    const token = localStorage.getItem("admin-token");
    if (!token) return;
    try {
      const res = await fetch("/api/admin/waitlist/convert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ waitlistId: row.id, action: "dismiss" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setEntries((prev) =>
        prev.map((e) => (e.id === row.id ? { ...e, status: "dismissed", linked_user: null } : e))
      );
      setSuccessBanner(`${row.email} dismissed.`);
      setServicesLink(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Dismiss failed");
    }
  }

  async function submitProvision() {
    if (!provision) return;
    const token = localStorage.getItem("admin-token");
    if (!token) return;
    setProvisionError("");
    setProvisionSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        waitlistId: provision.row.id,
        action: provision.action,
        password: formPassword,
        name: formName.trim(),
      };
      if (provision.action !== "create_buyer") {
        body.businessName = formBusiness.trim();
        body.baseCountry = formCountry;
      }
      const res = await fetch("/api/admin/waitlist/convert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setProvisionError(typeof data.error === "string" ? data.error : `HTTP ${res.status}`);
        setProvisionSubmitting(false);
        return;
      }
      const nextStatus = data.status as WaitlistStatus;
      const adminUser = data.adminUser as { id: string; email: string; name: string } | undefined;
      setEntries((prev) =>
        prev.map((e) =>
          e.id === provision.row.id
            ? {
                ...e,
                status: nextStatus,
                linked_admin_user_id: adminUser?.id ?? null,
                linked_user: adminUser
                  ? {
                      id: adminUser.id,
                      email: adminUser.email,
                      name: adminUser.name,
                      role: provision.action === "create_buyer" ? "user" : "seller",
                    }
                  : null,
              }
            : e
        )
      );
      setSuccessBanner(typeof data.message === "string" ? data.message : "Done.");
      if (typeof data.servicesUrl === "string") {
        setServicesLink(data.servicesUrl as string);
      } else {
        setServicesLink(null);
      }
      setProvision(null);
    } catch {
      setProvisionError("Request failed.");
    }
    setProvisionSubmitting(false);
  }

  function handleExportCsv() {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(filtered, `papposhop-waitlist-${stamp}.csv`);
  }

  if (loading && entries.length === 0 && !loadError) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-8">
        <div className="animate-pulse text-sm text-white/40">Loading waitlist...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {provision && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
          onClick={() => !provisionSubmitting && setProvision(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1D27] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-white">
              {provision.action === "create_buyer" && "Create buyer account"}
              {provision.action === "create_product_seller" && "Create product seller"}
              {provision.action === "create_service_provider" && "Create service provider account"}
            </h2>
            <p className="mt-1 text-xs text-white/45 font-mono break-all">{provision.row.email}</p>
            <p className="mt-3 text-sm text-white/50">
              {provision.action === "create_buyer" &&
                "Creates a shopper account (role: user). They sign in at /login."}
              {provision.action === "create_product_seller" &&
                "Creates a seller account for the marketplace shop. Same as Sellers → add seller."}
              {provision.action === "create_service_provider" &&
                "Creates a seller account used to link service listings. Then add their public service under Services."}
            </p>
            <div className="mt-5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1">Full name *</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]/50"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1">Temporary password * (min 6)</label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]/50"
                  autoComplete="new-password"
                />
              </div>
              {provision.action !== "create_buyer" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1">Business / display name *</label>
                    <input
                      value={formBusiness}
                      onChange={(e) => setFormBusiness(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1">Base country *</label>
                    <select
                      value={formCountry}
                      onChange={(e) => setFormCountry(e.target.value as (typeof COUNTRIES)[number])}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]/50"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-[#1A1D27]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {provisionError && <p className="text-sm text-red-400">{provisionError}</p>}
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={submitProvision}
                disabled={provisionSubmitting}
                className="flex-1 rounded-xl bg-[#4A9B3F] py-2.5 text-sm font-semibold text-white hover:bg-[#3D8234] disabled:opacity-50"
              >
                {provisionSubmitting ? "…" : "Create account"}
              </button>
              <button
                type="button"
                onClick={() => setProvision(null)}
                disabled={provisionSubmitting}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/15"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Waitlist</h1>
          <p className="mt-1 text-sm text-white/45">
            Turn sign-ups into accounts: buyers get a shopper login; sellers become product sellers or service providers
            (seller account + service listing).
          </p>
          {loadError && <p className="mt-2 text-sm text-red-400">{loadError}</p>}
          {successBanner && (
            <div className="mt-3 rounded-xl border border-[#4A9B3F]/30 bg-[#4A9B3F]/10 px-4 py-3 text-sm text-[#4A9B3F]/95">
              <p>{successBanner}</p>
              {servicesLink && (
                <Link
                  href={servicesLink}
                  className="mt-2 inline-block text-sm font-semibold text-white underline decoration-[#4A9B3F] underline-offset-2 hover:text-[#4A9B3F]"
                >
                  Open Services to add their listing →
                </Link>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={filtered.length === 0}
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Export CSV ({filtered.length})
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, accent: "text-white" },
          { label: "Pending action", value: stats.pending, accent: "text-amber-200" },
          { label: "Buyer sign-ups", value: stats.buyers, accent: "text-green-400" },
          { label: "Seller sign-ups", value: stats.sellers, accent: "text-blue-300" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/5 bg-[#1A1D27] p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-white/35">{s.label}</p>
            <p className={`mt-1 text-xl sm:text-2xl font-bold ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <input
          type="search"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full lg:max-w-xs rounded-xl border border-white/10 bg-[#1A1D27] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]/50"
        />
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] uppercase tracking-wide text-white/25 self-center mr-1">Signup</span>
          {(["all", "buyer", "seller"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                roleFilter === r
                  ? "bg-[#4A9B3F]/20 text-[#4A9B3F] ring-1 ring-[#4A9B3F]/40"
                  : "bg-white/5 text-white/50 hover:text-white"
              }`}
            >
              {r === "all" ? "All" : r === "buyer" ? "Buyers" : "Sellers"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] uppercase tracking-wide text-white/25 self-center mr-1">Status</span>
          {(
            [
              ["all", "All"],
              ["pending", "Pending"],
              ["done", "Onboarded"],
              ["dismissed", "Dismissed"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setStatusFilter(v)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === v
                  ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/35"
                  : "bg-white/5 text-white/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1A1D27]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-white/35">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Wants</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Signed up</th>
                <th className="px-4 py-3 font-medium min-w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-white/40">
                    No entries match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const wants = row.role === "seller" ? "seller" : "buyer";
                  const st = normalizeStatus(row.status);
                  const stInfo = STATUS_LABELS[st];
                  const isPending = st === "pending";
                  return (
                    <tr key={row.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-white font-mono text-[13px] align-top">{row.email}</td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            wants === "seller"
                              ? "border-blue-500/30 bg-blue-500/10 text-blue-200"
                              : "border-green-500/30 bg-green-500/10 text-green-200"
                          }`}
                        >
                          {wants}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${stInfo.className}`}
                        >
                          {stInfo.label}
                        </span>
                        {row.linked_user && (
                          <p className="mt-1 text-[11px] text-white/40">
                            → {row.linked_user.name} ({row.linked_user.role})
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/50 align-top whitespace-nowrap">
                        {formatDate(row.created_at)}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1.5">
                          {isPending && wants === "buyer" && (
                            <button
                              type="button"
                              onClick={() => setProvision({ row, action: "create_buyer" })}
                              className="text-left text-xs font-medium text-[#4A9B3F] hover:text-[#5cb350]"
                            >
                              Create buyer account
                            </button>
                          )}
                          {isPending && wants === "seller" && (
                            <>
                              <button
                                type="button"
                                onClick={() => setProvision({ row, action: "create_product_seller" })}
                                className="text-left text-xs font-medium text-blue-300 hover:text-blue-200"
                              >
                                Create product seller
                              </button>
                              <button
                                type="button"
                                onClick={() => setProvision({ row, action: "create_service_provider" })}
                                className="text-left text-xs font-medium text-violet-300 hover:text-violet-200"
                              >
                                Create service provider
                              </button>
                            </>
                          )}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleDismiss(row)}
                              className="text-left text-xs font-medium text-white/45 hover:text-white/70"
                            >
                              Dismiss (no account)
                            </button>
                          )}
                          {st === "service_provider_created" && row.linked_admin_user_id && (
                            <Link
                              href={`/admin/services?prefillSellerId=${row.linked_admin_user_id}`}
                              className="text-xs font-medium text-violet-300 hover:text-violet-200"
                            >
                              Add service listing
                            </Link>
                          )}
                          {st === "product_seller_created" && (
                            <Link href="/admin/sellers" className="text-xs font-medium text-blue-300 hover:text-blue-200">
                              Open Sellers
                            </Link>
                          )}
                          {st === "buyer_created" && (
                            <span className="text-[11px] text-white/35">Shopper login: /login</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(row.id)}
                            disabled={deletingId === row.id}
                            className="text-left text-xs font-medium text-red-400/90 hover:text-red-300 disabled:opacity-40"
                          >
                            {deletingId === row.id ? "…" : "Remove from waitlist"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
