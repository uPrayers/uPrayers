import React, { useState } from "react";

function App() {
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
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>uPrayers</h1>
      <p>A prayer for every heart, from every faith</p>
      <textarea
        rows="4"
        placeholder="Describe your situation..."
        value={situation}
        onChange={e => setSituation(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <select
        value={religion}
        onChange={e => setReligion(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        <option value="">Select your religion</option>
        {religions.map(r => <option key={r}>{r}</option>)}
      </select>
      <input
        placeholder="First name (optional)"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <input
        placeholder="Location (optional)"
        value={location}
        onChange={e => setLocation(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={handleGeneratePrayer}>Generate Prayer</button>

      {prayer && (
        <div style={{ marginTop: "2rem", backgroundColor: "#eef", padding: "1rem" }}>
          <h3>Your Prayer</h3>
          <p><i>{prayer}</i></p>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h2>Prayer Wall</h2>
        {communityPrayers.map((entry, idx) => (
          <div key={idx} style={{ backgroundColor: "#f4f4f4", padding: "1rem", marginBottom: "1rem" }}>
            <p><i>{entry.prayer}</i></p>
            {(entry.name || entry.location) && (
              <p>— {entry.name || "Anonymous"}, {entry.location || "Unknown"}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
