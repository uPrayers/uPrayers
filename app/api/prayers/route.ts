import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { ListPrayersSchema, SavePrayerSchema } from "../../../src/lib/validators";
import { moderateText } from "../../../src/lib/moderation";
import { getOpenAI } from "../../../src/lib/openai";

export const dynamic = "force-dynamic";

// GET /api/prayers?cursor=<id>&take=<n>
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;
  const takeParam = searchParams.get("take");
  const take = takeParam ? Number(takeParam) : 20;

  const parsed = ListPrayersSchema.safeParse({ cursor, take });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid pagination params" }, { status: 400 });
  }

  const where = {};
  const orderBy = [{ createdAt: "desc" as const }, { id: "desc" as const }];
  const list = await prisma.prayer.findMany({
    where,
    orderBy,
    take: parsed.data.take,
    ...(parsed.data.cursor ? { skip: 1, cursor: { id: parsed.data.cursor } } : {})
  });

  const nextCursor = list.length === parsed.data.take ? list[list.length - 1].id : null;
  return NextResponse.json({ prayers: list, nextCursor });
}

// POST -> save with anti-spam and unique enforcement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SavePrayerSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(", ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const openai = process.env.UPRAYERS_USE_AI_MODERATION === "true" ? getOpenAI() : undefined;
    const mod = await moderateText(`${parsed.data.religion}\n${parsed.data.situation}\n${parsed.data.text}`, openai as any);
    if (!mod.ok) return NextResponse.json({ error: "Content blocked (" + mod.reason + ")" }, { status: 422 });

    try {
      const created = await prisma.prayer.create({ data: parsed.data });
      return NextResponse.json({ prayer: created }, { status: 201 });
    } catch (e: any) {
      if (e?.code == "P2002") {
        return NextResponse.json({ error: "Duplicate prayer already exists." }, { status: 409 });
      }
      throw e;
    }
  } catch (err: any) {
    console.error("/api/prayers POST error", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
