// app/api/generate-prayer/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { GeneratePrayerSchema } from "../../../src/lib/validators";
import { getOpenAI } from "../../../src/lib/openai";
import { createPrayer } from "../../../src/lib/prayer";

function fallbackPrayer(religion: string, situation: string) {
  const s = situation.trim();
  return `🙏 We lift up this ${s}, asking for courage, wisdom, and peace. May comfort meet every worry and hope steady each step, in the spirit of ${religion}.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GeneratePrayerSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(", ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Try OpenAI first
    try {
      const openai = getOpenAI(); // throws if OPENAI_API_KEY missing
      const prayer = await createPrayer(openai, parsed.data);
      return NextResponse.json({ prayer });
    } catch (aiErr: any) {
      console.error("AI generate failed, using fallback:", aiErr?.message || aiErr);
      // Always return JSON so the UI never parses HTML error pages
      return NextResponse.json({
        prayer: fallbackPrayer(parsed.data.religion, parsed.data.situation),
        note: "AI temporarily unavailable; used built-in fallback."
      }, { status: 200 });
    }
  } catch (err: any) {
    console.error("/api/generate-prayer error", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
