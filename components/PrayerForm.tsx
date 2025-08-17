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

const RELIGIONS = [
  "Catholic",
  "Protestant",
  "Non-Denominational",
  "Latter-day Saint",
  "Orthodox",
  "Jewish",
  "Muslim",
  "Hindu",
  "Buddhist",
  "Secular",
  "Other",
];

const PAGE_SIZE = 100; // per your preference: show most recent 100 before "Load more"

export default function PrayerForm() {
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [religion, setReligion] = React.useState(RELIGIONS[1]); // Protestant by default
  const [situation, setSituation] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [generated, setGenerated] = React.useState<string | null>(null);
  const [wall, setWall] = React.useState<Prayer[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [postBusy, setPostBusy] = React.useState(false);

  function showNotice(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2000);
  }

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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      await fetchWall(); // refresh from top
      showNotice("Posted to the wall.");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPostBusy(false);
    }
  }

  function handleCopy() {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(
      () => showNotice("Copied to clipboard."),
      () => showNotice("Copy failed. Select and copy manually.")
    );
  }

  function handleGenerateNew() {
    setGenerated(null);
    handleGenerate();
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      {/* Intro + Form */}
      <div className="card">
        <div className="section">
          <h1>uPrayers</h1>
          <p className="lead">Share your situation, choose your tradition, and receive a short, compassionate prayer. You can post it to the wall for others to see.</p>
          {notice && <div className="note" role="status" aria-live="polite">{notice}</div>}
          {error && <div className="error" role="alert">{error}</div>}
        </div>
        <div className="section">
          <div className="grid">
            <label className="label" htmlFor="name">First name (optional)</label>
            <input id="name" className="input" placeholder="e.g., Chris" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid" style={{ marginTop: 10 }}>
            <label className="label" htmlFor="location">Location (optional)</label>
            <input id="location" className="input" placeholder="e.g., Atlanta, GA" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="grid" style={{ marginTop: 10 }}>
            <label className="label" htmlFor="religion">Faith / Tradition</label>
            <select id="religion" className="select" value={religion} onChange={(e) => setReligion(e.target.value)}>
              {RELIGIONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="grid" style={{ marginTop: 10 }}>
            <label className="label" htmlFor="situation">What do you want prayer for?</label>
            <textarea id="situation" className="textarea" placeholder="A sentence or two…" value={situation} onChange={(e) => setSituation(e.target.value)} />
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <button className="btn primary" onClick={handleGenerate} disabled={loading}>
              {loading ? <>Generating<span className="spinner" /></> : "Generate Prayer"}
            </button>
          </div>
        </div>

        {generated && (
          <div className="section" aria-live="polite">
            <div className="label" style={{ marginBottom: 8 }}>Your Prayer</div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{generated}</div>
            </div>
            <div className="actions" style={{ marginTop: 12 }}>
              <button className="btn" onClick={handleGenerateNew} disabled={loading}>Generate New</button>
              <button className="btn ghost" onClick={handleCopy}>Copy to Clipboard</button>
              <button className="btn primary" onClick={handlePostToWall} disabled={postBusy}>
                {postBusy ? <>Posting<span className="spinner" /></> : "Post to Prayer Wall"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Prayer Wall */}
      <div className="card">
        <div className="section">
          <h2 style={{ margin: 0, fontSize: 22 }}>Prayer Wall</h2>
          <p className="note" style={{ marginTop: 6 }}>Most recent {Math.min(wall.length, PAGE_SIZE)} shown first.</p>
        </div>
        <div className="section grid">
          {wall.length === 0 && <div className="note">No prayers yet.</div>}
          {wall.map((p) => (
            <div key={p.id} className="card prayer-item">
              <div className="meta">
                <span>{new Date(p.createdAt).toLocaleString()}</span>
                <span>—</span>
                <span style={{ fontWeight: 600 }}>{p.religion}</span>
                {p.name && <span>• {p.name}</span>}
                {p.location && <span>• {p.location}</span>}
              </div>
              <div style={{ paddingTop: 6, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{p.text}</div>
            </div>
          ))}
          {nextCursor && (
            <button className="btn ghost" onClick={() => fetchWall(nextCursor)}>Load more</button>
          )}
        </div>
      </div>
    </div>
  );
}
