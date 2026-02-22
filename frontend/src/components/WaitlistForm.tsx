"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
    <section id="waitlist" className="py-24 sm:py-32 bg-walnut">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-terracotta-light uppercase tracking-wide">
            Be the First to Know
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-cream tracking-tight">
            Join the PappoCrafts Waitlist
          </h2>
          <p className="mt-4 text-lg text-cream/60 leading-relaxed">
            Whether you want to discover unique handmade products or sell your own
            creations, sign up to get early access when we launch.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto">
            <div className="flex gap-3 mb-4 justify-center">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  role === "buyer"
                    ? "bg-terracotta text-white"
                    : "bg-walnut-light text-cream/60 hover:text-cream"
                }`}
              >
                I want to buy
              </button>
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  role === "seller"
                    ? "bg-olive text-white"
                    : "bg-walnut-light text-cream/60 hover:text-cream"
                }`}
              >
                I want to sell
              </button>
            </div>

            <div className="flex gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className="flex-1 rounded-full bg-walnut-light px-5 py-3 text-cream placeholder:text-cream/40 border border-cream/10 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-terracotta/25 hover:bg-terracotta-dark disabled:opacity-50 transition-all"
              >
                {status === "loading" ? "..." : "Join"}
              </button>
            </div>

            {status === "success" && (
              <p className="mt-4 text-sm text-olive-light font-medium">
                {message}
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 text-sm text-terracotta-light font-medium">
                {message}
              </p>
            )}
          </form>

          <p className="mt-6 text-xs text-cream/40">
            No spam, ever. We&apos;ll only email you about PappoCrafts updates.
          </p>
        </div>
      </div>
    </section>
  );
}
