import { describe, it, expect } from "vitest";
import { GeneratePrayerSchema, SavePrayerSchema, ListPrayersSchema } from "@/lib/validators";

describe("GeneratePrayerSchema", () => {
  it("accepts minimal valid input", () => {
    const parsed = GeneratePrayerSchema.safeParse({ situation: "health", religion: "Christian" });
    expect(parsed.success).toBe(true);
  });
  it("rejects empty situation", () => {
    const parsed = GeneratePrayerSchema.safeParse({ situation: "", religion: "Jewish" });
    expect(parsed.success).toBe(false);
  });
});

describe("SavePrayerSchema", () => {
  it("accepts full valid input", () => {
    const parsed = SavePrayerSchema.safeParse({ name: "Lenore", location: "Paris", religion: "Catholic", situation: "travel mercies", text: "A short prayer" });
    expect(parsed.success).toBe(true);
  });
  it("rejects missing text", () => {
    const parsed = SavePrayerSchema.safeParse({ religion: "Buddhist", situation: "stress" });
    expect(parsed.success).toBe(false);
  });
});

describe("ListPrayersSchema", () => {
  it("defaults are valid when omitted", () => {
    const parsed = ListPrayersSchema.safeParse({});
    expect(parsed.success).toBe(true);
  });
  it("rejects invalid take", () => {
    const parsed = ListPrayersSchema.safeParse({ take: 1000 });
    expect(parsed.success).toBe(false);
  });
});
