import React, { useState, useEffect } from "react";

const days = [ { label: "Monday", key: "mon" }, { label: "Tuesday", key: "tue" }, { label: "Wednesday", key: "wed" }, { label: "Thursday", key: "thu" }, { label: "Friday", key: "fri" }, ];

export default function App() { const [notes, setNotes] = useState({});

useEffect(() => { const saved = localStorage.getItem("agenda-notes"); if (saved) setNotes(JSON.parse(saved)); }, []);

useEffect(() => { localStorage.setItem("agenda-notes", JSON.stringify(notes)); }, [notes]);

const handleChange = (key, value) => { setNotes(prev => ({ ...prev, [key]: value })); };

const renderLines = (dayKey) => ( <div contentEditable suppressContentEditableWarning onInput={(e) => handleChange(dayKey, e.currentTarget.innerText)} style={{ minHeight: "120px", fontSize: "1rem", outline: "none", whiteSpace: "pre-wrap", borderBottom: "1px solid #ccc", padding: "0.25rem 0", lineHeight: "1.6", }} > {notes[dayKey] || "\n\n\n\n\n"} </div> );

return ( <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", padding: "1rem", fontFamily: "sans-serif", minHeight: "100vh", gap: "1rem", }}>

{/* Left Column */}
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    {days.slice(0, 3).map(day => (
      <div key={day.key}>
        <h3>{day.label}</h3>
        {renderLines(day.key)}
      </div>
    ))}
  </div>

  {/* Divider Line */}
  <div style={{ backgroundColor: "#ccc", width: "1px" }} />

  {/* Right Column */}
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    {days.slice(3).map(day => (
      <div key={day.key}>
        <h3>{day.label}</h3>
        {renderLines(day.key)}
      </div>
    ))}
    <div>
      <h3>Weekly Notes</h3>
      {renderLines("weekly")}
    </div>
  </div>
</div>

); 
}

