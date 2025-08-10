"use client";
import React from "react";

type Prayer = {
  id: string;
  createdAt: string;
  name?: string | null;
  location?: string | null;
  religion: string;
  situation: string;
  text: string;
};

const PAGE_SIZE = 20;

export default function PrayerForm() {
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [religion, setReligion] = React.useState("Christian");
  const [situation, setSituation] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [generated, setGenerated] = React.useState<string | null>(null);
  const [wall, setWall] = React.useState<Prayer[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [postBusy, setPostBusy] = React.useState(false);

  async function fetchWall(cursor?: string) {
    try {
      const url = new URL(window.location.origin + "/api/prayers");
      url.searchParams.set("take", String(PAGE_SIZE));
      if (cursor) url.searchParams.set("cursor", cursor);

      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load wall");
      setWall(prev => (cursor ? [...prev, ...data.prayers] : data.prayers));
      setNextCursor(data.nextCursor || null);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  }

  React.useEffect(() => { fetchWall(); }, []);

  async function handleGenerate() {
    setError(null);
    if (!situation.trim()) {
      setError("Please describe your situation.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate-prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, religion, name: name || null, location: location || null })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate prayer");
      setGenerated(data.prayer);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostToWall() {
    if (!generated) return;
    setPostBusy(true);
    try {
      const res = await fetch("/api/prayers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || null, location: location || null, religion, situation, text: generated })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post");
      await fetchWall();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPostBusy(false);
    }
  }

  function handleCopy() {
    if (!generated) return;
    navigator.clipboard.writeText(generated).catch(() => {});
  }

  function handleGenerateNew() {
    setGenerated(null);
    handleGenerate();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-3xl font-bold">uPrayers</h1>
      <p className="text-sm opacity-80">Describe your situation, choose a faith tradition, and generate a short prayer. Post it to the wall so others can pray for you.</p>

      <div className="grid gap-3">
        <input className="border rounded p-2" placeholder="First name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border rounded p-2" placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select className="border rounded p-2" value={religion} onChange={(e) => setReligion(e.target.value)}>
          <option>Christian</option>
          <option>Jewish</option>
          <option>Muslim</option>
          <option>Hindu</option>
          <option>Buddhist</option>
          <option>Secular</option>
          <option>Catholic</option>
          <option>Orthodox</option>
          <option>Other</option>
        </select>
        <textarea className="border rounded p-2 min-h-[120px]" placeholder="What do you want prayer for?" value={situation} onChange={(e) => setSituation(e.target.value)} />
        <button className="rounded-xl border px-4 py-2 disabled:opacity-50" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating…" : "Generate Prayer"}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>

      {generated && (
        <div className="space-y-3 border rounded-xl p-4 bg-white/50">
          <h2 className="font-semibold">Your Prayer</h2>
          <p className="whitespace-pre-wrap">{generated}</p>
          <div className="flex gap-2 pt-2">
            <button className="border rounded px-3 py-2" onClick={handleGenerateNew}>Generate New</button>
            <button className="border rounded px-3 py-2" onClick={handleCopy}>Copy to Clipboard</button>
            <button className="border rounded px-3 py-2 disabled:opacity-50" onClick={handlePostToWall} disabled={postBusy}>Post to Prayer Wall</button>
          </div>
        </div>
      )}

      <div className="space-y-2 pt-6">
        <h2 className="text-2xl font-semibold">Prayer Wall</h2>
        <div className="space-y-3">
          {wall.length === 0 && <div className="opacity-70">No prayers yet.</div>}
          {wall.map((p) => (
            <div key={p.id} className="border rounded-xl p-3">
              <div className="text-sm opacity-60 flex flex-wrap gap-1">
                <span>{new Date(p.createdAt).toLocaleString()}</span>
                <span>—</span>
                <span className="font-medium">{p.religion}</span>
                {p.name && <span>• {p.name}</span>}
                {p.location && <span>• {p.location}</span>}
              </div>
              <div className="pt-2 whitespace-pre-wrap">{p.text}</div>
            </div>
          ))}
          {nextCursor && (
            <button className="border rounded px-3 py-2" onClick={() => fetchWall(nextCursor!)}>Load more</button>
          )}
        </div>
      </div>
    </div>
  );
}
