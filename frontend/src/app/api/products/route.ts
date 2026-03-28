import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redactPublicListingContact } from "@/lib/public-listing-response";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const category = searchParams.get("category");
  const stockFilter = searchParams.get("in_stock");

  try {
    const db = createAdminClient();

    if (id) {
      const { data, error } = await db
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("approval_status", "approved")
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(redactPublicListingContact(data as Record<string, unknown>), {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    }

    let query = db
      .from("products")
      .select("*")
      .eq("approval_status", "approved")
      .order("created_at", { ascending: false });

    if (stockFilter === "true") {
      query = query.eq("in_stock", true);
    } else if (stockFilter === "false") {
      query = query.eq("in_stock", false);
    }

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data || []).map((r) => redactPublicListingContact(r as Record<string, unknown>));
    return NextResponse.json(rows, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
