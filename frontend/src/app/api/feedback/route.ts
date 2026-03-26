import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const reportType = String(formData.get("report_type") || "feedback");
    const validTypes = ["bug", "feedback", "suggestion"];
    const reportTypeSafe = validTypes.includes(reportType) ? reportType : "feedback";

    const payload = {
      report_type: reportTypeSafe,
      email: String(formData.get("email") || "").trim() || null,
      title: String(formData.get("title") || "").trim() || null,
      what_you_were_doing: String(formData.get("what_you_were_doing") || "").trim() || null,
      expected_behavior: String(formData.get("expected_behavior") || "").trim() || null,
      actual_behavior: String(formData.get("actual_behavior") || "").trim() || null,
      url: String(formData.get("url") || "").trim() || null,
      severity: String(formData.get("severity") || "").trim() || null,
      browser: String(formData.get("browser") || "").trim() || null,
      device: String(formData.get("device") || "").trim() || null,
      what_you_liked: String(formData.get("what_you_liked") || "").trim() || null,
      what_was_confusing: String(formData.get("what_was_confusing") || "").trim() || null,
      suggestions: String(formData.get("suggestions") || "").trim() || null,
      ease_of_use: String(formData.get("ease_of_use") || "").trim() || null,
      comment: String(formData.get("comment") || "").trim() || null,
    };

    const supabase = createAdminClient();
    const { error } = await supabase.from("feedback").insert(payload);

    if (error) {
      console.error("[Feedback] Supabase insert failed:", error);
      return NextResponse.json(
        { error: "Failed to save feedback. Please use the mailto link below." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Feedback] Error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please use the mailto link below." },
      { status: 500 }
    );
  }
}
