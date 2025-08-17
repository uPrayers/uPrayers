// components/PrayerForm.tsx
"use client";

import { useRef, useState } from "react";

type GenerateResponse = {
  prayer?: string;
  error?: string;
};

export default function PrayerForm() {
  const [loading, setLoading] = useState(false);
  const [prayer, setPrayer] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setPrayer(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      situation: String(form.get("situation") || "").trim(),
      name: String(form.get("name") || "").trim() || null,
      location: String(form.get("location") || "").trim() || null,
      religion: String(form.get("religion") || "Non-Denominational"),
    };

    try {
      const res = await fetch("/api/generate-prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: GenerateResponse = await res.json();

      if (!res.ok || !data.prayer) {
        throw new Error(data.error || "Failed to generate prayer");
      }

      setPrayer(data.prayer);

      // Smooth scroll to the generated prayer AFTER it renders
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      console.error(err);
      setPrayer("We couldn’t generate a prayer right now. Please try again.");
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="prayer-form" className="mx-auto max-w-2xl px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Share your situation</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="situation"
          required
          rows={5}
          className="w-full rounded-xl border p-3"
          placeholder="What would you like prayer for?"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            name="name"
            className="rounded-xl border p-3"
            placeholder="First name (optional)"
          />
          <input
            name="location"
            className="rounded-xl border p-3"
            placeholder="Location (optional)"
          />
          <select name="religion" className="rounded-xl border p-3">
            <option>Catholic</option>
            <option>Protestant</option>
            <option>Non-Denominational</option>
            <option>Latter-day Saint</option>
            <option>Orthodox</option>
            <option>Jewish</option>
            <option>Muslim</option>
            <option>Hindu</option>
            <option>Buddhist</option>
            <option>Secular</option>
            <option>Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-2xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
        >
          {loading ? "Generating…" : "Generate Prayer"}
        </button>
      </form>

      {/* Scroll target for the generated prayer */}
      <div id="generated-prayer" ref={resultRef} className="scroll-mt-28 mt-8">
        {prayer && (
          <article className="rounded-xl border p-4 bg-white/70">
            <h3 className="mb-2 text-lg font-semibold">Your Prayer</h3>
            <p className="whitespace-pre-line">{prayer}</p>
          </article>
        )}
      </div>
    </section>
  );
}
