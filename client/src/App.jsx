import React, { useState } from "react";

export default function UPrayersApp() {
  const [situation, setSituation] = useState("");
  const [religion, setReligion] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [prayer, setPrayer] = useState("");
  const [communityPrayers, setCommunityPrayers] = useState([]);

  const religions = [
    "Christianity (Catholic)",
    "Christianity (Protestant)",
    "Christianity (Orthodox)",
    "Islam (Sunni)",
    "Islam (Shia)",
    "Judaism (Orthodox)",
    "Judaism (Reform)",
    "Buddhism", "Hinduism", "Sikhism", "Other"
  ];

  const handleGeneratePrayer = async () => {
    if (!situation || !religion) return;
    const response = await fetch("https://uprayers-backend.onrender.com/api/generate-prayer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ situation, religion })
    });
    const data = await response.json();
    setPrayer(data.prayer);
    setCommunityPrayers(prev => [
      { prayer: data.prayer, name, location },
      ...prev
    ]);
  };

  return (
    <div className="font-sans scroll-smooth bg-gradient-to-b from-white to-blue-50 text-gray-900">
      <section className="py-20 text-center bg-gradient-to-r from-blue-100 to-white">
        <h1 className="text-5xl font-bold mb-4">uPrayers</h1>
        <p className="text-xl mb-8">A prayer for every heart, from every faith</p>
        <a href="#form" className="bg-blue-600 text-white py-3 px-6 rounded shadow hover:bg-blue-700">Request a Prayer</a>
      </section>

      <section id="form" className="max-w-2xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Share Your Prayer Request</h2>
        <textarea
          className="w-full p-3 border rounded mb-4"
          rows="4"
          placeholder="Describe your situation..."
          value={situation}
          onChange={e => setSituation(e.target.value)}
        />
        <select
          className="w-full p-3 border rounded mb-4"
          value={religion}
          onChange={e => setReligion(e.target.value)}
        >
          <option value="">Select your religion</option>
          {religions.map(r => <option key={r}>{r}</option>)}
        </select>
        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="First name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Location (optional)"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleGeneratePrayer}>
          Generate Prayer
        </button>
      </section>

      {prayer && (
        <section className="max-w-2xl mx-auto py-10 px-4 bg-green-50 border-t">
          <h3 className="text-2xl font-semibold mb-4 text-green-900">Your Prayer</h3>
          <p className="italic mb-4">{prayer}</p>
        </section>
      )}

      <section className="bg-white py-16 px-4 border-t" id="wall">
        <h2 className="text-3xl font-bold text-center mb-6">Prayer Wall</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {communityPrayers.map((entry, idx) => (
            <div key={idx} className="bg-blue-100 p-4 rounded shadow">
              <p className="italic">{entry.prayer}</p>
              {(entry.name || entry.location) && (
                <p className="mt-2 text-sm text-gray-700">
                  — {entry.name || "Anonymous"}, {entry.location || "Unknown"}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="donate" className="py-16 px-4 text-center bg-gradient-to-r from-yellow-100 to-white border-t">
        <h2 className="text-3xl font-bold mb-4">Support uPrayers</h2>
        <p className="mb-6 max-w-xl mx-auto">Your donation helps us keep the prayers flowing. We rely on generous hearts like yours to maintain the site and spread hope worldwide.</p>
        <a href="https://buy.stripe.com/test_cNi00k6Ge5zdfiL2UzeIw00" target="_blank" rel="noopener noreferrer" className="bg-yellow-500 text-white py-3 px-6 rounded shadow hover:bg-yellow-600">Donate with Stripe</a>
      </section>

      <footer className="text-center text-sm py-6 text-gray-500 bg-white border-t">
        © {new Date().getFullYear()} uPrayers.com — A place for every faith
      </footer>
    </div>
  );
}
