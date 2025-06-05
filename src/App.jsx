// Weekly Agenda App with Two-Column Layout and File/Link Support
// Note: This is a simplified structure to restore the original two-column layout with week headers

import React, { useState } from "react";
import "./App.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const generateWeekRange = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4);

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

function App() {
  const [notes, setNotes] = useState({});

  const currentMonday = (() => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date;
  })();

  const weekRange = generateWeekRange(currentMonday);

  const updateNote = (day, line, value) => {
    setNotes((prev) => {
      const updated = { ...prev };
      if (!updated[day]) updated[day] = Array(6).fill("");
      updated[day][line] = value;
      return updated;
    });
  };

  const renderDay = (day, index) => (
    <div key={day} className="day">
      <div className="day-header">
        <strong>{day}</strong>
        <span className="date-label">
          {new Date(currentMonday.getTime() + index * 86400000).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      </div>
      <div className="lines">
        {Array.from({ length: 6 }).map((_, i) => (
          <textarea
            key={i}
            className="line"
            value={notes[day]?.[i] || ""}
            onChange={(e) => updateNote(day, i, e.target.value)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="agenda">
      <h1 className="week-label">{weekRange}</h1>
      <div className="grid">
        <div className="column">
          {days.slice(0, 3).map((day, index) => renderDay(day, index))}
        </div>
        <div className="column">
          {days.slice(3).map((day, index) => renderDay(day, index + 3))}
          <div className="day">
            <div className="day-header">
              <strong>Weekly Notes</strong>
            </div>
            <div className="lines">
              {Array.from({ length: 6 }).map((_, i) => (
                <textarea
                  key={i}
                  className="line"
                  value={notes["Weekly Notes"]?.[i] || ""}
                  onChange={(e) => updateNote("Weekly Notes", i, e.target.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
