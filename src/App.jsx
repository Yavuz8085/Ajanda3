import React, { useState, useEffect } from "react";

const days = [
  { label: "Monday", key: "mon" },
  { label: "Tuesday", key: "tue" },
  { label: "Wednesday", key: "wed" },
  { label: "Thursday", key: "thu" },
  { label: "Friday", key: "fri" },
];

export default function App() {
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("agenda-notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("agenda-notes", JSON.stringify(notes));
  }, [notes]);

  const handleChange = (key, value) => {
    setNotes(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        padding: "1rem",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {days.slice(0, 3).map(day => (
          <div key={day.key}>
            <h3>{day.label}</h3>
            <textarea
              style={{ width: "100%", height: "80px", fontSize: "1rem" }}
              value={notes[day.key] || ""}
              onChange={(e) => handleChange(day.key, e.target.value)}
              placeholder={`Write notes for ${day.label}...`}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {days.slice(3).map(day => (
          <div key={day.key}>
            <h3>{day.label}</h3>
            <textarea
              style={{ width: "100%", height: "80px", fontSize: "1rem" }}
              value={notes[day.key] || ""}
              onChange={(e) => handleChange(day.key, e.target.value)}
              placeholder={`Write notes for ${day.label}...`}
            />
          </div>
        ))}
        <div>
          <h3>Weekly Notes</h3>
          <textarea
            style={{ width: "100%", height: "80px", fontSize: "1rem" }}
            value={notes["weekly"] || ""}
            onChange={(e) => handleChange("weekly", e.target.value)}
            placeholder="Write general notes for the week..."
          />
        </div>
      </div>
    </div>
  );
}
