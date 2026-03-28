"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/lib/locale-context";

const labelClass = "block text-sm font-medium text-charcoal/70";
const inputClass =
  "mt-1 w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-green focus:outline-none focus:ring-1 focus:ring-green/30";
const sectionClass = "space-y-4 border-t border-charcoal/10 pt-4 mt-4";

export default function FeedbackForm() {
  const { t } = useLocale();
  const [reportType, setReportType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const showBug = reportType === "bug";
  const showFeedback = reportType === "feedback" || reportType === "suggestion";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setDone(true);
        return;
      }
      setError(typeof data.error === "string" ? data.error : "Submission failed.");
    } catch {
      setError("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-green/20 bg-green/10 px-4 py-4 text-sm text-charcoal">
        {t("feedback.success")}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Report type *</label>
        <select
          name="report_type"
          required
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className={inputClass}
        >
          <option value="">— Select —</option>
          <option value="bug">Bug / technical error</option>
          <option value="feedback">General feedback</option>
          <option value="suggestion">Improvement suggestion</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Email (optional)</label>
        <input type="email" name="email" className={inputClass} placeholder="For follow-up" autoComplete="email" />
      </div>

      {showBug && (
        <div className={sectionClass}>
          <div>
            <label className={labelClass}>Short title *</label>
            <input type="text" name="title" className={inputClass} required={showBug} placeholder="e.g. Save button does not work" />
          </div>
          <div>
            <label className={labelClass}>What were you doing when this happened? *</label>
            <textarea name="what_you_were_doing" className={`${inputClass} min-h-[80px]`} required={showBug} />
          </div>
          <div>
            <label className={labelClass}>What did you expect?</label>
            <textarea name="expected_behavior" className={`${inputClass} min-h-[64px]`} />
          </div>
          <div>
            <label className={labelClass}>What actually happened? *</label>
            <textarea name="actual_behavior" className={`${inputClass} min-h-[80px]`} required={showBug} />
          </div>
          <div>
            <label className={labelClass}>Page URL</label>
            <input type="text" name="url" className={inputClass} placeholder="https://…" />
          </div>
          <div>
            <label className={labelClass}>Severity</label>
            <select name="severity" className={inputClass}>
              <option value="blocking">Blocking (cannot continue)</option>
              <option value="major">Major (feature broken)</option>
              <option value="minor">Minor (inconvenience)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Browser</label>
            <select name="browser" className={inputClass}>
              <option value="chrome">Chrome</option>
              <option value="edge">Edge</option>
              <option value="firefox">Firefox</option>
              <option value="safari">Safari</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Device</label>
            <input type="text" name="device" className={inputClass} placeholder="e.g. Windows laptop, iPhone" />
          </div>
        </div>
      )}

      {showFeedback && (
        <div className={sectionClass}>
          <div>
            <label className={labelClass}>What did you like?</label>
            <textarea name="what_you_liked" className={`${inputClass} min-h-[64px]`} />
          </div>
          <div>
            <label className={labelClass}>What was confusing or frustrating?</label>
            <textarea name="what_was_confusing" className={`${inputClass} min-h-[64px]`} />
          </div>
          <div>
            <label className={labelClass}>Improvement suggestions</label>
            <textarea name="suggestions" className={`${inputClass} min-h-[64px]`} />
          </div>
          <div>
            <label className={labelClass}>Easy to use? (1–5)</label>
            <select name="ease_of_use" className={inputClass}>
              <option value="">—</option>
              <option value="1">1 — Very difficult</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 — Very easy</option>
            </select>
          </div>
        </div>
      )}

      <div className={sectionClass}>
        <label className={labelClass}>Comment / additional details</label>
        <textarea name="comment" className={`${inputClass} min-h-[80px]`} placeholder="Anything else" />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          <p>{error}</p>
          <p className="mt-2 text-xs text-red-700/90">
            {t("feedback.errorTryEmail")}{" "}
            <span className="font-mono font-medium select-all">{t("footer.supportEmail")}</span>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-green px-6 py-3 text-sm font-semibold text-white shadow-md shadow-green/25 hover:bg-green-dark disabled:opacity-50 disabled:pointer-events-none transition-colors sm:w-auto"
      >
        {submitting ? t("feedback.submitting") : t("feedback.submit")}
      </button>
    </form>
  );
}
