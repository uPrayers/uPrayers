import OpenAI from "openai";

const BAD_PATTERNS = [
  /https?:\/\/\S+/i,
  /(buy\s+now|call\s+this\s+number|free\s+crypto)/i,
  /(sex|porn|xxx|viagra)/i,
  /(hate\s+speech|kill\s+yourself|suicide)/i
];

export async function moderateText(text: string, openai?: OpenAI): Promise<{ ok: boolean; reason?: string }> {
  const t = text.trim();
  if (t.length < 3) return { ok: false, reason: "too_short" };
  if (t.length > 4000) return { ok: false, reason: "too_long" };
  for (const re of BAD_PATTERNS) {
    if (re.test(t)) return { ok: false, reason: "pattern_block" };
  }

  if (process.env.UPRAYERS_USE_AI_MODERATION === "true" && openai) {
    try {
      const res = await openai.moderations.create({
        model: "omni-moderation-latest",
        input: t
      } as any);
      const flagged = (res as any)?.results?.[0]?.flagged;
      if (flagged) return { ok: false, reason: "ai_flag" };
    } catch {
      // ignore AI moderation errors and rely on heuristics
    }
  }
  return { ok: true };
}
