// src/lib/openai.ts
import OpenAI from "openai";

export function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

export const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
