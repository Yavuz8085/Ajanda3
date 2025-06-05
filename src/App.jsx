import React, { useState, useEffect } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getCurrentWeekStart(date = new Date()) {
  const today = new Date(date);
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekDates(startDate) {
  const days = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function App() {
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart());
  const [notes, setNotes] = useState({});

  const weekDates = getWeekDates(weekStart);
  const weekKey = weekStart.toISOString().split("T")[0];

  useEffect(() => {
    const saved = localStorage.getItem("agenda-notes-" + weekKey);
    if (saved) setNotes(JSON.parse(saved));
    else setNotes({});
  }, [weekKey]);

  useEffect(() => {
    localStorage.setItem("agenda-notes-" + weekKey, JSON.stringify(notes));
  }, [notes, weekKey]);

  const handleChange = (key, value) => {
    setNotes(prev => ({ ...prev, [key]: value }));
  };

  const formatFullDate = (date) =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const formatShortWeek = (start, end) => {
    const options = { day: "2-digit", month: "long" };
    const startDay = start.toLocaleDateString("en-GB", options);
    const endDay = end.toLocaleDateString("en-GB", options);

    const [startD, startM] = startDay.split(" ");
    const [endD, endM] = endDay.split(" ");

    if (startM === endM) return `${startD}-${endD} ${startM} ${start.getFullYear()}`;
    else return `${startD} ${startM} – ${endD} ${endM} ${end.getFullYear()}`;
  };

  const goToPreviousWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          onClick={goToPreviousWeek}
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
        >⬅️</span>
        <h2>{formatShortWeek(weekDates[0], weekDates[4])}</h2>
        <span
          onClick={goToNextWeek}
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
        >➡️</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          gap: "1rem",
          marginTop: "1rem"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {days.slice(0, 3).map((day, i) => (
            <div key={day}>
              <h3>{day} – {formatFullDate(weekDates[i])}</h3>
              <textarea
                style={{
                  width: "100%",
                  height: "120px",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  border: "none",
                  borderBottom: "1px solid #ccc",
                  resize: "none",
                  outline: "none",
                  background: "transparent"
                }}
                value={notes[day] || ""}
                onChange={(e) => handleChange(day, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div style={{ backgroundColor: "#ccc", width: "1px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {days.slice(3).map((day, i) => (
            <div key={day}>
              <h3>{day} – {formatFullDate(weekDates[i + 3])}</h3>
              <textarea
                style={{
                  width: "100%",
                  height: "120px",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  border: "none",
                  borderBottom: "1px solid #ccc",
                  resize: "none",
                  outline: "none",
                  background: "transparent"
                }}
                value={notes[day] || ""}
                onChange={(e) => handleChange(day, e.target.value)}
              />
            </div>
          ))}
          <div>
            <h3>Weekly Notes</h3>
            <textarea
              style={{
                width: "100%",
                height: "120px",
                fontSize: "1rem",
                lineHeight: "1.6",
                border: "none",
                borderBottom: "1px solid #ccc",
                resize: "none",
                outline: "none",
                background: "transparent"
              }}
              value={notes["weekly"] || ""}
              onChange={(e) => handleChange("weekly", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
