import React, { useState, useEffect, useRef } from "react";

const days = ["Monday"];
const maxRows = 5;

export default function App() {
  const [notes, setNotes] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  const holdTimeout = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("agenda-prototype");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("agenda-prototype", JSON.stringify(notes));
  }, [notes]);

  const handleTextChange = (day, rowIndex, value) => {
    setNotes(prev => {
      const updated = { ...prev };
      if (!updated[day]) updated[day] = Array(maxRows).fill({ text: "", files: [] });
      updated[day][rowIndex] = { ...updated[day][rowIndex], text: value };
      return updated;
    });
  };

  const handleFileChange = (day, rowIndex, files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files).slice(0, 2);

    const readers = fileList.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, data: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(uploadedFiles => {
      setNotes(prev => {
        const updated = { ...prev };
        if (!updated[day]) updated[day] = Array(maxRows).fill({ text: "", files: [] });
        const current = updated[day][rowIndex] || { text: "", files: [] };
        updated[day][rowIndex] = {
          ...current,
          files: [...current.files, ...uploadedFiles].slice(0, 2),
        };
        return updated;
      });
    });

    setActivePopup(null);
  };

  const startHold = (day, rowIndex) => {
    holdTimeout.current = setTimeout(() => {
      setActivePopup(`${day}-${rowIndex}`);
    }, 2000);
  };

  const cancelHold = () => {
    clearTimeout(holdTimeout.current);
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", maxWidth: 800, margin: "auto" }}>
      {days.map(day => (
        <div key={day} style={{ marginBottom: "2rem" }}>
          <h2>{day}</h2>
          {Array.from({ length: maxRows }).map((_, rowIndex) => {
            const row = notes[day]?.[rowIndex] || { text: "", files: [] };
            return (
              <div
                key={rowIndex}
                onPointerDown={() => startHold(day, rowIndex)}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #ccc",
                  padding: "0.5rem 0"
                }}
              >
                {row.files.length > 0 && <span style={{ marginRight: 8 }}>📁</span>}
                <textarea
                  placeholder=""
                  style={{
                    width: "100%",
                    height: "24px",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    border: "none",
                    resize: "none",
                    outline: "none",
                    background: "transparent"
                  }}
                  value={row.text}
                  onChange={(e) => handleTextChange(day, rowIndex, e.target.value)}
                />
                {activePopup === `${day}-${rowIndex}` && (
                  <div style={{ position: "absolute", background: "white", border: "1px solid #ccc", padding: 6, zIndex: 10 }}>
                    <label style={{ cursor: "pointer" }}>
                      📎 Add file
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={(e) => handleFileChange(day, rowIndex, e.target.files)}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
