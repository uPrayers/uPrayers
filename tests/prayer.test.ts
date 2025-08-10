import { describe, it, expect, vi } from "vitest";
import { buildSystemPrompt, buildUserPrompt, createPrayer } from "@/lib/prayer";
import { moderateText } from "@/lib/moderation";
import type OpenAI from "openai";

describe("prompts", () => {
  it("builds system prompt", () => {
    expect(buildSystemPrompt().toLowerCase()).toContain("concise");
  });
  it("builds user prompt with fallbacks", () => {
    const p = buildUserPrompt({ religion: "Christian", situation: "help", name: null, location: "" });
    expect(p).toContain("Religion: Christian");
    expect(p).toContain("Name: (not provided)");
    expect(p).toContain("Location: (not provided)");
    expect(p).toContain("Situation: help");
  });
});

describe("createPrayer", () => {
  it("returns text from OpenAI", async () => {
    const mockOpenAI = { chat: { completions: { create: vi.fn().mockResolvedValue({ choices: [{ message: { content: "prayer text" } }] }) } } } as unknown as OpenAI;
    const text = await createPrayer(mockOpenAI, { religion: "Secular", situation: "work stress" });
    expect(text).toBe("prayer text");
  });
  it("throws if no text returned", async () => {
    const mockOpenAI = { chat: { completions: { create: vi.fn().mockResolvedValue({ choices: [{ message: { content: "" } }] }) } } } as unknown as OpenAI;
    await expect(createPrayer(mockOpenAI, { religion: "Jewish", situation: "healing" })).rejects.toThrow();
  });
});

describe("moderation heuristics", () => {
  it("blocks link spam", async () => {
    const r = await moderateText("Please visit http://spam.example now!");
    expect(r.ok).toBe(false);
  });
  it("accepts normal text", async () => {
    const r = await moderateText("Requesting prayer for an interview tomorrow.");
    expect(r.ok).toBe(true);
  });
});
