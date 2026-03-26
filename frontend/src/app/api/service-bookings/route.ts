import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function parseHHMM(s: string): string | null {
  const t = s.trim();
  if (!/^\d{1,2}:\d{2}$/.test(t)) return null;
  const [h, m] = t.split(":").map(Number);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function hoursBetween(start: string, end: string): number | null {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const a = sh * 60 + sm;
  const b = eh * 60 + em;
  if (b <= a) return null;
  return Math.round(((b - a) / 60) * 100) / 100;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const providerId = String(body.providerId || "").trim();
    const providerName = String(body.providerName || "").trim();
    const providerCategory = String(body.providerCategory || "").trim() || null;
    const customerName = String(body.customerName || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const customerPhone = String(body.customerPhone || "").trim() || null;
    const preferredDate = String(body.preferredDate || "").trim();
    const timeStart = parseHHMM(String(body.timeStart || ""));
    const timeEnd = parseHHMM(String(body.timeEnd || ""));
    const message = String(body.message || "").trim();
    const hourlyRateEur = Number(body.hourlyRateEur);
    const locale = String(body.locale || "").trim() || null;

    if (!providerId || !providerName || !customerName || !customerEmail || !preferredDate || !timeStart || !timeEnd || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const duration = hoursBetween(timeStart, timeEnd);
    if (duration == null || duration <= 0 || duration > 24) {
      return NextResponse.json({ error: "End time must be after start time (max 24h)" }, { status: 400 });
    }
    const rate = Number.isFinite(hourlyRateEur) && hourlyRateEur >= 0 ? hourlyRateEur : 0;
    const estimatedTotal = rate > 0 ? Math.round(duration * rate * 100) / 100 : null;

    const supabase = createAdminClient();
    const { error } = await supabase.from("service_bookings").insert({
      provider_id: providerId,
      provider_name: providerName,
      provider_category: providerCategory,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      preferred_date: preferredDate,
      time_window_start: timeStart,
      time_window_end: timeEnd,
      duration_hours: duration,
      hourly_rate_eur: rate,
      estimated_total_eur: estimatedTotal,
      message,
      locale,
    });

    if (error) {
      console.error("[service-bookings]", error);
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[service-bookings]", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
