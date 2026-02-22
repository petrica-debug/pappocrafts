"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { t } = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're on the list!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  }

  return (
    <section id="waitlist" className="py-24 sm:py-32 bg-charcoal">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-green-light uppercase tracking-wide">
            {t("waitlist.badge")}
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t("waitlist.title")}
          </h2>
          <p className="mt-4 text-lg text-white/60 leading-relaxed">
            {t("waitlist.desc")}
          </p>

          <form onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto">
            <div className="flex gap-3 mb-4 justify-center">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  role === "buyer"
                    ? "bg-green text-white"
                    : "bg-charcoal-light text-white/60 hover:text-white"
                }`}
              >
                {t("waitlist.buyer")}
              </button>
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  role === "seller"
                    ? "bg-blue text-white"
                    : "bg-charcoal-light text-white/60 hover:text-white"
                }`}
              >
                {t("waitlist.seller")}
              </button>
            </div>

            <div className="flex gap-3">
              <input
                type="email"
                required
                placeholder={t("waitlist.placeholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className="flex-1 rounded-full bg-charcoal-light px-5 py-3 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green/25 hover:bg-green-dark disabled:opacity-50 transition-all"
              >
                {status === "loading" ? "..." : t("waitlist.join")}
              </button>
            </div>

            {status === "success" && (
              <p className="mt-4 text-sm text-green-light font-medium">{message}</p>
            )}
            {status === "error" && (
              <p className="mt-4 text-sm text-red-400 font-medium">{message}</p>
            )}
          </form>

          <p className="mt-6 text-xs text-white/40">
            {t("waitlist.noSpam")}
          </p>
        </div>
      </div>
    </section>
  );
}
