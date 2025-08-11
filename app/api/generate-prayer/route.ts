import { NextRequest, NextResponse } from "app/api/generate-prayer/route.ts";
import { GeneratePrayerSchema } from "../../../src/lib/validators";
import { getOpenAI } from "../../../src/lib/openai";
import { createPrayer } from "../../../src/lib/prayer";


export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GeneratePrayerSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(", ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const openai = getOpenAI();
    const prayer = await createPrayer(openai, parsed.data);
    return NextResponse.json({ prayer });
  } catch (err: any) {
    console.error("/api/generate-prayer error", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
