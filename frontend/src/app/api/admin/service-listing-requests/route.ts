import { NextRequest, NextResponse } from "next/server";
import { validateSession, type Session } from "@/lib/admin-store";
import { createAdminClient } from "@/lib/supabase/admin";

async function getSession(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return validateSession(token);
}

function isStaff(s: Session | null) {
  return s && (s.role === "superadmin" || s.role === "admin");
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!isStaff(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "pending";

  const db = createAdminClient();
  let q = db.from("service_listing_requests").select("*").order("created_at", { ascending: false });
  if (status === "pending") q = q.eq("status", "pending");
  else if (status === "all") {
    /* no filter */
  } else {
    q = q.eq("status", status);
  }

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data ?? [] });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession(request);
  if (!isStaff(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const id = String(body.id || "");
    const status = body.status;
    if (!id || (status !== "approved" && status !== "rejected" && status !== "pending")) {
      return NextResponse.json({ error: "id and status (pending|approved|rejected) required." }, { status: 400 });
    }

    const db = createAdminClient();
    const { data, error } = await db
      .from("service_listing_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // When a listing request is approved, publish (or refresh) it into public services.
    // Uses a deterministic service id so re-approvals stay idempotent.
    if (status === "approved" && data) {
      const row = data as Record<string, unknown>;
      const requestId = String(row.id || "").trim();
      const contactEmail = String(row.contact_email || "").trim().toLowerCase();
      let sellerId: string | null = null;

      if (contactEmail) {
        const { data: sellerMatch } = await db
          .from("admin_users")
          .select("id, role")
          .eq("email", contactEmail)
          .in("role", ["seller", "admin", "superadmin"])
          .maybeSingle();
        sellerId = (sellerMatch?.id as string | undefined) ?? null;
      }

      const hourlyRaw = row.hourly_rate;
      const hourlyRate =
        typeof hourlyRaw === "number"
          ? hourlyRaw
          : typeof hourlyRaw === "string"
            ? Number(hourlyRaw)
            : 0;
      const publishedServiceId = `service-request-${requestId}`;

      const { error: publishError } = await db.from("services").upsert(
        {
          id: publishedServiceId,
          name: String(row.contact_name || row.service_title || "Service Provider").trim(),
          provider_name: String(row.contact_name || "").trim(),
          title: String(row.service_title || "").trim(),
          summary: String(row.service_description || "").trim(),
          description: String(row.service_description || "").trim(),
          long_description: String(row.service_description || "").trim(),
          category: String(row.service_category || "").trim(),
          hourly_rate: Number.isFinite(hourlyRate) ? Math.max(0, hourlyRate) : 0,
          currency: String(row.currency || "EUR").trim().toUpperCase() || "EUR",
          location: String(row.location || "").trim(),
          country: String(row.country || "").trim(),
          phone: String(row.contact_phone || "").trim(),
          image: String(row.image_url || "").trim(),
          available: true,
          response_time: "Within 24 hours",
          completed_jobs: 0,
          seller_id: sellerId,
          badges: [],
        },
        { onConflict: "id" }
      );

      if (publishError) {
        return NextResponse.json({ error: publishError.message }, { status: 500 });
      }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
