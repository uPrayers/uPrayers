"use client";
import React from "react";

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

// Public donation link (set in Render env as NEXT_PUBLIC_DONATE_URL)
const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL || "/donate";

export default function PrayerForm() {
  const [remember, setRemember] = React.useState(false);
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [religion, setReligion] = React.useState(RELIGIONS[0]);

  // Load once on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const r = localStorage.getItem("remember") === "1";
    setRemember(r);

    if (r) {
      setName(localStorage.getItem("name") ?? "");
      setLocation(localStorage.getItem("location") ?? "");
      setReligion(localStorage.getItem("religion") ?? RELIGIONS[0]);
    }
  }, []);

  // Persist if remember is checked
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("remember", remember ? "1" : "0");

    if (remember) {
      localStorage.setItem("name", name);
      localStorage.setItem("location", location);
      localStorage.setItem("religion", religion);
    } else {
      localStorage.removeItem("name");
      localStorage.removeItem("location");
      localStorage.removeItem("religion");
    }
  }, [remember, name, location, religion]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Your submit logic here...
    console.log({ name, location, religion });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">First Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm">Religion</label>
        <select
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
          className="w-full border rounded p-2"
        >
          {RELIGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="remember"
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <label htmlFor="remember" className="text-sm">
          Remember me
        </label>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-amber-600 text-white rounded px-4 py-2"
        >
          Post to Prayer Wall
        </button>
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white rounded px-4 py-2 flex items-center justify-center"
        >
          Donate
        </a>
      </div>
    </form>
  );
}
