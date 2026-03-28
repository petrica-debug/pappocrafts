import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-store";
import { createAdminClient } from "@/lib/supabase/admin";

function getSession(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return validateSession(token);
}

function isStaff(s: ReturnType<typeof validateSession>) {
  return s && (s.role === "superadmin" || s.role === "admin");
}

export async function GET(request: NextRequest) {
  const session = getSession(request);
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
  const session = getSession(request);
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
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
