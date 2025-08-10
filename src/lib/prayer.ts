import { GeneratePrayerInput } from "@/lib/validators";
import { MODEL } from "@/lib/openai";
import OpenAI from "openai";

export function buildSystemPrompt() {
  return "You write concise, compassionate prayers. Keep it 4-6 sentences max. Match the selected religion's tone while staying welcoming.";
}

export function buildUserPrompt({ religion, name, location, situation }: GeneratePrayerInput) {
  const safe = (v?: string | null) => (v && v.trim().length > 0 ? v.trim() : "(not provided)");
  return `Religion: ${safe(religion)}\nName: ${safe(name)}\nLocation: ${safe(location)}\nSituation: ${situation.trim()}`;
}

export async function createPrayer(openai: OpenAI, input: GeneratePrayerInput) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(input) }
    ],
    temperature: 0.7,
    max_tokens: 200
  });
  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("No prayer generated. Check model/key.");
  return text;
}
