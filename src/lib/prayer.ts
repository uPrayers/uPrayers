// src/lib/prayer.ts
import { GeneratePrayerInput } from "./validators";
import { MODEL } from "./openai";
import OpenAI from "openai";

export function buildSystemPrompt() {
  return "You are a spiritual prayer writer. Your prayers are brief, compassionate, and uplifting. Use 4–8 sentences (roughly one paragraph). Match the tone and traditions of the faith provided, while keeping the words gentle and welcoming for anyone to read. Offer comfort, hope, and a sense of presence.";
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
    max_tokens: 300
  });

  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("No prayer generated. Check model/key.");
  return text;
}
