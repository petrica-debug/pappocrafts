"use client";

import { useEffect, useState } from "react";

type FeedbackEntry = {
  id: string;
  report_type: "bug" | "feedback" | "suggestion";
  email: string | null;
  title: string | null;
  what_you_were_doing: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  url: string | null;
  severity: string | null;
  browser: string | null;
  device: string | null;
  what_you_liked: string | null;
  what_was_confusing: string | null;
  suggestions: string | null;
  ease_of_use: string | null;
  comment: string | null;
  created_at: string;
};

const REPORT_LABELS: Record<string, { label: string; badgeClass: string }> = {
  bug: { label: "Bug", badgeClass: "bg-red-500/15 text-red-300 border-red-500/30" },
  feedback: { label: "Feedback", badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  suggestion: { label: "Suggestion", badgeClass: "bg-amber-500/15 text-amber-200 border-amber-500/30" },
};

export default function AdminFeedbackPage() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/admin/feedback", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data: { entries?: FeedbackEntry[] }) => {
        setEntries(data.entries ?? []);
        setLoadError(null);
      })
      .catch((e) => {
        console.error("[Feedback] Fetch error:", e);
        setLoadError(e instanceof Error ? e.message : "Failed to load");
        setEntries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter((e) => {
    const matchSearch =
      !search ||
      [e.title, e.email, e.comment, e.actual_behavior, e.what_you_liked, e.what_was_confusing, e.suggestions]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === "all" || e.report_type === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total: entries.length,
    bugs: entries.filter((e) => e.report_type === "bug").length,
    feedback: entries.filter((e) => e.report_type === "feedback").length,
    suggestions: entries.filter((e) => e.report_type === "suggestion").length,
  };

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

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-8">
        <div className="animate-pulse text-sm text-white/40">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Feedback</h1>
        <p className="mt-1 text-sm text-white/45">Submissions from the testing feedback form</p>
        {loadError && <p className="mt-2 text-sm text-red-400">{loadError}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total", value: stats.total, accent: "text-white" },
          { label: "Bugs", value: stats.bugs, accent: "text-red-400" },
          { label: "Feedback", value: stats.feedback, accent: "text-blue-300" },
          { label: "Suggestions", value: stats.suggestions, accent: "text-amber-200" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/5 bg-[#1A1D27] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-white/35">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#1A1D27] p-5">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0F1117] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#4A9B3F]/50 focus:outline-none"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0F1117] px-4 py-2.5 text-sm text-white focus:border-[#4A9B3F]/50 focus:outline-none"
          >
            <option value="all">All types</option>
            <option value="bug">Bugs</option>
            <option value="feedback">Feedback</option>
            <option value="suggestion">Suggestions</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-white/40">No feedback entries found</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((e) => {
                const meta = REPORT_LABELS[e.report_type] ?? REPORT_LABELS.feedback;
                const isExpanded = expandedId === e.id;
                return (
                  <div key={e.id} className="bg-[#1A1D27] transition-colors hover:bg-white/[0.02]">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : e.id)}
                      className="flex w-full items-start gap-4 p-4 text-left"
                    >
                      <span
                        className={`shrink-0 rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">
                          {e.title || e.comment?.slice(0, 60) || "(No title)"}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-white/40">
                          {e.email && <span>{e.email}</span>}
                          <span>{formatDate(e.created_at)}</span>
                          {e.browser && <span className="capitalize">{e.browser}</span>}
                          {e.severity && e.report_type === "bug" && (
                            <span className="font-medium text-amber-400/90">{e.severity}</span>
                          )}
                        </div>
                      </div>
                      <svg
                        className={`h-5 w-5 shrink-0 text-white/30 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="space-y-3 border-t border-white/5 bg-[#0F1117]/50 px-4 pb-4 pt-3 text-sm text-white/70">
                        {e.report_type === "bug" && (
                          <>
                            {e.what_you_were_doing && (
                              <div>
                                <p className="font-medium text-white/50">What they were doing</p>
                                <p className="mt-0.5 whitespace-pre-wrap">{e.what_you_were_doing}</p>
                              </div>
                            )}
                            {e.expected_behavior && (
                              <div>
                                <p className="font-medium text-white/50">Expected</p>
                                <p className="mt-0.5 whitespace-pre-wrap">{e.expected_behavior}</p>
                              </div>
                            )}
                            {e.actual_behavior && (
                              <div>
                                <p className="font-medium text-white/50">What happened</p>
                                <p className="mt-0.5 whitespace-pre-wrap">{e.actual_behavior}</p>
                              </div>
                            )}
                            {e.url && (
                              <p>
                                <span className="font-medium text-white/50">URL:</span> {e.url}
                              </p>
                            )}
                            {e.device && (
                              <p>
                                <span className="font-medium text-white/50">Device:</span> {e.device}
                              </p>
                            )}
                          </>
                        )}
                        {(e.report_type === "feedback" || e.report_type === "suggestion") && (
                          <>
                            {e.what_you_liked && (
                              <div>
                                <p className="font-medium text-white/50">What they liked</p>
                                <p className="mt-0.5 whitespace-pre-wrap">{e.what_you_liked}</p>
                              </div>
                            )}
                            {e.what_was_confusing && (
                              <div>
                                <p className="font-medium text-white/50">What was confusing</p>
                                <p className="mt-0.5 whitespace-pre-wrap">{e.what_was_confusing}</p>
                              </div>
                            )}
                            {e.suggestions && (
                              <div>
                                <p className="font-medium text-white/50">Suggestions</p>
                                <p className="mt-0.5 whitespace-pre-wrap">{e.suggestions}</p>
                              </div>
                            )}
                            {e.ease_of_use && (
                              <p>
                                <span className="font-medium text-white/50">Ease of use (1–5):</span> {e.ease_of_use}
                              </p>
                            )}
                          </>
                        )}
                        {e.comment && (
                          <div>
                            <p className="font-medium text-white/50">Additional comment</p>
                            <p className="mt-0.5 whitespace-pre-wrap">{e.comment}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
