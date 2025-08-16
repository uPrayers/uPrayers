// app/api/generate-prayer/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { GeneratePrayerSchema } from "../../../src/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GeneratePrayerSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(", ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // ✅ TEMP: bypass OpenAI to verify the route/UI end-to-end
    const s = parsed.data.situation.trim();
    const r = parsed.data.religion;
    return NextResponse.json({
      prayer: `🙏 (test) May you find strength and peace in this moment. We lift up your ${s} with hope and compassion, in the spirit of ${r}.`
    });
  } catch (err: any) {
    console.error("/api/generate-prayer error", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
