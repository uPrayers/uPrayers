"use client";
import React from "react";

// Clean UI/UX version WITHOUT any share code.
// - Optional persistence via "Remember me" (session-style default)
// - Textarea autosize
// - Friendly loading states
// - Name, Location, Faith order on the wall

// Public donation link used in client (set in Render env as NEXT_PUBLIC_DONATE_URL)
const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL || "/donate";

type Prayer = {
  id: string;
  createdAt: string;
  name?: string | null;
  location?: string | null;
  religion: string;
  situation: string;
  text: string;
};

const RELIGIONS: string[] = [
  "Catholic",
  "Protestant",
  "Non-Denominational Christian",
  "Latter-day Saint",
  "Orthodox",
  "Jewish",
  "Muslim",
  "Hindu",
  "Buddhist",
  "Secular",
  "Other",
];

const PAGE_SIZE = 20; // show most recent 20 before "Load more"
const LS_KEYS = { name: "upr_name", location: "upr_location", religion: "upr_religion" } as const;
const REMEMBER_KEY = "upr_remember";

// If you add a sticky header later, bump this number to match its height.
const HEADER_OFFSET = 85;

export default function PrayerForm() {
  const [remember, setRemember] = React.useState<boolean>(false);

  const [name, setName] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [religion, setReligion] = React.useState<string>("Protestant");
  const [situation, setSituation] = React.useState<string>("");

  const [loading, setLoading] = React.useState(false);
  const [generated, setGenerated] = React.useState<string | null>(null);
  const [wall, setWall] = React.useState<Prayer[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [postBusy, setPostBusy] = React.useState(false);
  const [wallBusy, setWallBusy] = React.useState(false);
  const [initialWallLoading, setInitialWallLoading] = React.useState(true);

  const situationRef = React.useRef<HTMLTextAreaElement | null>(null);
  const generateAbortRef = React.useRef<AbortController | null>(null);
  const formRef = React.useRef<HTMLDivElement | null>(null);
  const generatedRef = React.useRef<HTMLDivElement | null>(null);

  // Respect user preference for reduced motion
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return false;
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }, []);

  // Auto-scroll new prayer so its top aligns to the top of the viewport (with a small offset)
  React.useEffect(() => {
    if (!generated) return;
    const id = requestAnimationFrame(() => {
      const el = generatedRef.current;
      if (!el) return;
      try {
        const top = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - HEADER_OFFSET;
        window.scrollTo({
          top,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
        // Keep focus accessible without re-scrolling
        el.focus?.({ preventScroll: true });
      } catch {
        /* no-op */
      }
    });
    return () => cancelAnimationFrame(id);
  }, [generated, prefersReducedMotion]);

  function showNotice(msg: string) {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2000);
  }

  // --- Remember toggle: load once on mount ---
  React.useEffect(() => {
    try {
      const r = localStorage.getItem(REMEMBER_KEY) === "1";
      setRemember(r);
      if (r) {
        const n = localStorage.getItem(LS_KEYS.name);
        const l = localStorage.getItem(LS_KEYS.location);
        const rr = localStorage.getItem(LS_KEYS.religion);
        if (n) setName(n);
        if (l) setLocation(l);
        if (rr && RELIGIONS.includes(rr)) setReligion(rr);
      }
    } catch {
      /* no-op */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Persist name/location/religion only if remember === true ---
  React.useEffect(() => {
    try {
      localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
      if (!remember) {
        // Clear any previously saved values when turning off
        localStorage.removeItem(LS_KEYS.name);
        localStorage.removeItem(LS_KEYS.location);
        localStorage.removeItem(LS_KEYS.religion);
      } else {
        // When on, immediately store current values
        localStorage.setItem(LS_KEYS.name, name);
        localStorage.setItem(LS_KEYS.location, location);
        localStorage.setItem(LS_KEYS.religion, religion);
      }
    } catch {
      /* no-op */
    }
  }, [remember]); // only when the toggle changes

  // When remember is ON, keep values in sync; when OFF, do nothing
  React.useEffect(() => {
    if (!remember) return;
    try {
      localStorage.setItem(LS_KEYS.name, name);
    } catch {}
  }, [remember, name]);

  React.useEffect(() => {
    if (!remember) return;
    try {
      localStorage.setItem(LS_KEYS.location, location);
    } catch {}
  }, [remember, location]);

  React.useEffect(() => {
    if (!remember) return;
    try {
      localStorage.setItem(LS_KEYS.religion, religion);
    } catch {}
  }, [remember, religion]);

  // --- Textarea autosize ---
  React.useEffect(() => {
    const el = situationRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 400) + "px";
  }, [situation]);

  // --- Wall fetching ---
  async function fetchWall(cursor?: string) {
    try {
      if (!cursor) setInitialWallLoading(true);
      setWallBusy(Boolean(cursor));
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
    } finally {
      setInitialWallLoading(false);
      setWallBusy(false);
    }
  }
  React.useEffect(() => { fetchWall(); }, []);

  // --- Generate prayer ---
  async function handleGenerate() {
    setError(null);
    const trimmed = situation.trim();
    if (trimmed.length < 3) {
      setError("Please describe your situation (at least 3 characters).");
      return;
    }

    if (generateAbortRef.current) generateAbortRef.current.abort();
    const ctrl = new AbortController();
    generateAbortRef.current = ctrl;

    setLoading(true);
    try {
      const res = await fetch("/api/generate-prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: trimmed, religion, name: name || null, location: location || null }),
        signal: ctrl.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate prayer");
      setGenerated(data.prayer); // scrolling handled by effect above
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // --- Post prayer ---
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

  function handleClearForm() {
    setName("");
    setLocation("");
    setReligion("Protestant");
    setSituation("");
    setGenerated(null);
  }

  const generateDisabled = loading || situation.trim().length < 3;

  return (
    <div className="grid" style={{ gap: 22 }}>
      {/* Intro + Form */}
      <div className="card" aria-busy={loading} ref={formRef}>
        <div className="section">
          <h1>uPrayers</h1>
          <p className="lead">Share your situation, choose your religion, and receive a short, compassionate prayer. You can post it to the wall for others to see.</p>
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

          {/* Remember me toggle */}
          <div className="grid" style={{ marginTop: 10 }}>
            <label className="label" htmlFor="remember">Preferences</label>
            <div className="note" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                aria-describedby="remember-help"
              />
              <span>Remember my name, location, and faith on this device</span>
            </div>
            <div id="remember-help" className="note" style={{ marginTop: 4 }}>
              When off, fields reset every time you reopen the site.
            </div>
          </div>

          <div className="grid" style={{ marginTop: 10 }}>
            <label className="label" htmlFor="situation">What do you want prayer for?</label>
            <textarea
              id="situation"
              ref={situationRef}
              className="textarea"
              placeholder="A sentence or two…"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              maxLength={500}
            />
            <div className="note" style={{ textAlign: "right" }}>{situation.length}/500</div>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <button className="btn primary" onClick={handleGenerate} disabled={generateDisabled}>
              {loading ? <>Generating<span className="spinner" /></> : "Generate Prayer"}
            </button>
            <button className="btn ghost" onClick={handleClearForm} disabled={loading}>Clear</button>
          </div>
        </div>

        {generated && (
          <div
            className="section"
            aria-live="polite"
            id="generated-prayer"
            ref={generatedRef}
            tabIndex={-1}
            style={{ scrollMarginTop: HEADER_OFFSET }}
          >
            <div className="label" style={{ marginBottom: 8 }}>Your Prayer</div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.75 }}>{generated}</div>
            </div>
            <div className="actions" style={{ marginTop: 12 }}>
              <button className="btn" onClick={handleGenerateNew} disabled={loading}>Generate New</button>
              <button className="btn ghost" onClick={handleCopy}>Copy to Clipboard</button>
              <button className="btn primary" onClick={handlePostToWall} disabled={postBusy}>
                {postBusy ? <>Posting<span className="spinner" /></> : "Post to Prayer Wall"}
              </button>
              <a className="btn ghost" href={DONATE_URL} target="_blank" rel="noreferrer">Donate</a>
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
          {initialWallLoading && (
            <div className="card prayer-item" style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🕯️</div>
              <div className="note">Lighting a candle… loading prayers</div>
            </div>
          )}
          {!initialWallLoading && wall.length === 0 && (
            <div className="card prayer-item" style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🕯️</div>
              <div className="note" style={{ marginBottom: 10 }}>No prayers on the wall yet.</div>
              <button className="btn primary" onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                Be the first to post a prayer
              </button>
            </div>
          )}
          {wall.map((p) => (
            <div key={p.id} className="card prayer-item">
              <div className="meta">
                <span>{new Date(p.createdAt).toLocaleString()}</span>
                <span>—</span>
                {(p.name || p.location) ? (
                  <>
                    {p.name && <span>{p.name}</span>}
                    {p.location && <span>{p.name ? ' • ' : ''}{p.location}</span>}
                    <span> • <span style={{ fontWeight: 600 }}>{p.religion}</span></span>
                  </>
                ) : (
                  <span style={{ fontWeight: 600 }}>{p.religion}</span>
                )}
              </div>
              <div style={{ paddingTop: 6, whiteSpace: "pre-wrap", lineHeight: 1.75 }}>{p.text}</div>
            </div>
          ))}
          {nextCursor && (
            <button className="btn ghost" onClick={() => fetchWall(nextCursor)} disabled={wallBusy}>
              {wallBusy ? <>Loading<span className="spinner" /></> : "Load more"}
            </button>
          )}
          {/* Kept the page-level DonateSection responsible for an extra donate button if desired */}
        </div>
      </div>
    </div>
  );
}
