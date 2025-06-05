// Weekly Agenda App with Two-Column Layout and Navigation import React, { useState } from "react"; import "./App.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; const msPerDay = 86400000; const linesPerDay = 6;

const getMonday = (d) => { const date = new Date(d); const day = date.getDay(); const diff = date.getDate() - day + (day === 0 ? -6 : 1); date.setDate(diff); date.setHours(0, 0, 0, 0); return date; };

const formatDate = (date, withYear = false) => { return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", ...(withYear && { year: "numeric" }), }); };

function App() { const today = new Date(); const [weekOffset, setWeekOffset] = useState(0); const baseMonday = getMonday(today); const currentMonday = new Date(baseMonday.getTime() + weekOffset * 7 * msPerDay);

const [notes, setNotes] = useState({});

const key = currentMonday.toISOString().slice(0, 10);

const updateNote = (day, line, value) => { setNotes((prev) => { const updated = { ...prev }; if (!updated[key]) updated[key] = {}; if (!updated[key][day]) updated[key][day] = Array(linesPerDay).fill(""); updated[key][day][line] = value; return updated; }); };

const renderDay = (day, index) => { const entries = notes[key]?.[day] || Array(linesPerDay).fill(""); const thisDate = new Date(currentMonday.getTime() + index * msPerDay); const dateLabel = formatDate(thisDate);

return (
  <div key={day} className="day">
    <div className="day-header">
      <strong>{day}</strong> – <span className="date-label">{dateLabel}</span>
    </div>
    <div className="lines">
      {entries.map((val, i) => (
        <textarea
          key={i}
          className="line"
          placeholder="Write your note..."
          value={val}
          onChange={(e) => updateNote(day, i, e.target.value)}
        />
      ))}
    </div>
  </div>
);

};

const renderNotes = () => { const entries = notes[key]?.["Weekly Notes"] || Array(linesPerDay).fill(""); return ( <div className="day"> <div className="day-header"> <strong>Weekly Notes</strong> </div> <div className="lines"> {entries.map((val, i) => ( <textarea key={i} className="line" placeholder="Write your note..." value={val} onChange={(e) => updateNote("Weekly Notes", i, e.target.value)} /> ))} </div> </div> ); };

const weekRangeText = ${formatDate(currentMonday, true)} – ${formatDate( new Date(currentMonday.getTime() + 4 * msPerDay), true )};

return ( <div className="agenda"> <div className="navigation"> <button onClick={() => setWeekOffset((prev) => prev - 1)}>←</button> <h1 className="week-label">{weekRangeText}</h1> <button onClick={() => setWeekOffset((prev) => prev + 1)}>→</button> </div> <div className="grid"> <div className="column"> {days.slice(0, 3).map((day, i) => renderDay(day, i))} </div> <div className="column"> {days.slice(3).map((day, i) => renderDay(day, i + 3))} {renderNotes()} </div> </div> </div> ); }

export default App;

