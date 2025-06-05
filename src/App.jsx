import React, { useState, useEffect, useRef } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const maxRows = 5;

export default function App() {
  const [notes, setNotes] = useState({});
  const [activeRow, setActiveRow] = useState(null);
  const [popupFile, setPopupFile] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("agenda-enhanced");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("agenda-enhanced", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const handleClickOutside = () => setPopupFile(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleTextChange = (day, rowIndex, value) => {
    setNotes(prev => {
      const updated = { ...prev };
      if (!updated[day]) updated[day] = Array(maxRows).fill({ text: "", files: [], links: [] });
      updated[day][rowIndex] = { ...updated[day][rowIndex], text: value };
      return updated;
    });
  };

  const handleFileUpload = (day, rowIndex, files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files).slice(0, 2);

    const readers = fileList.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(uploadedFiles => {
      setNotes(prev => {
        const updated = { ...prev };
        if (!updated[day]) updated[day] = Array(maxRows).fill({ text: "", files: [], links: [] });
        const current = updated[day][rowIndex];
        updated[day][rowIndex] = {
          ...current,
          files: [...current.files, ...uploadedFiles].slice(0, 2)
        };
        return updated;
      });
    });
  };

  const handleAddLink = (day, rowIndex) => {
    const url = prompt("Enter a URL:");
    if (!url) return;
    setNotes(prev => {
      const updated = { ...prev };
      if (!updated[day]) updated[day] = Array(maxRows).fill({ text: "", files: [], links: [] });
      const current = updated[day][rowIndex];
      updated[day][rowIndex] = {
        ...current,
        links: [...current.links, url]
      };
      return updated;
    });
  };

  const handleErase = ({ type, day, rowIndex, index }) => {
    setNotes(prev => {
      const updated = { ...prev };
      if (!updated[day]) return prev;
      const current = updated[day][rowIndex];
      if (type === "file") {
        current.files.splice(index, 1);
      } else if (type === "link") {
        current.links.splice(index, 1);
      }
      updated[day][rowIndex] = { ...current };
      return updated;
    });
    setPopupFile(null);
  };

  const getFileIcon = (name) => {
    if (name.match(/\.pdf$/i)) return "📄";
    if (name.match(/\.(doc|docx)$/i)) return "📝";
    if (name.match(/\.(xls|xlsx)$/i)) return "📊";
    if (name.match(/\.(ppt|pptx)$/i)) return "📽";
    if (name.match(/\.(jpg|jpeg|png|webp)$/i)) return "🖼";
    return "📁";
  };

  const showMenu = (day, rowIndex) => {
    setActiveRow({ day, rowIndex });
  };

  const hideMenu = () => setActiveRow(null);

  const handleIconClick = (e, type, day, rowIndex, index) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupFile({ type, day, rowIndex, index });
    setMenuPosition({ x: rect.left - 80, y: rect.bottom });
  };

  const handleOpen = ({ type, day, rowIndex, index }) => {
    const item = notes[day][rowIndex][type === "file" ? "files" : "links"][index];
    const link = type === "file" ? item.data : item;
    window.open(link, "_blank");
    setPopupFile(null);
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", maxWidth: 800, margin: "auto" }}>
      {days.map(day => (
        <div key={day} style={{ marginBottom: "2rem" }}>
          <h2>{day}</h2>
          {Array.from({ length: maxRows }).map((_, rowIndex) => {
            const row = notes[day]?.[rowIndex] || { text: "", files: [], links: [] };
            const isActive = activeRow && activeRow.day === day && activeRow.rowIndex === rowIndex;

            return (
              <div key={rowIndex} style={{ display: "flex", alignItems: "flex-start", borderBottom: "1px solid #ccc", padding: "0.5rem 0", position: "relative" }}>
                <textarea
                  placeholder="Write your note..."
                  style={{
                    width: "100%",
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    border: "none",
                    resize: "vertical",
                    outline: "none",
                    background: "transparent"
                  }}
                  rows={2}
                  value={row.text}
                  onChange={(e) => handleTextChange(day, rowIndex, e.target.value)}
                />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 8 }}>
                  <button
                    onClick={() => showMenu(day, rowIndex)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
                  >📎</button>

                  {isActive && (
                    <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ccc", zIndex: 10 }}>
                      <label style={{ display: "block", padding: "0.5rem", cursor: "pointer" }}>
                        📄 File
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                          onChange={(e) => {
                            handleFileUpload(day, rowIndex, e.target.files);
                            hideMenu();
                          }}
                          style={{ display: "none" }}
                        />
                      </label>
                      <div style={{ padding: "0.5rem", cursor: "pointer" }} onClick={() => {
                        handleAddLink(day, rowIndex);
                        hideMenu();
                      }}>
                        🌐 Link
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ marginLeft: 12, display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                  {row.files.map((file, i) => (
                    <div key={i} onClick={(e) => handleIconClick(e, "file", day, rowIndex, i)} style={{ fontSize: "1.2rem", cursor: "pointer" }}>
                      {getFileIcon(file.name)}
                    </div>
                  ))}
                  {row.links.map((link, j) => (
                    <div key={j} onClick={(e) => handleIconClick(e, "link", day, rowIndex, j)} style={{ fontSize: "1.2rem", cursor: "pointer" }}>
                      🌐
                    </div>
                  ))}
                </div>
                {popupFile && popupFile.day === day && popupFile.rowIndex === rowIndex && (
                  <div style={{ position: "fixed", top: menuPosition?.y, left: menuPosition?.x, background: "white", border: "1px solid #ccc", zIndex: 20, padding: "0.5rem" }}>
                    <div onClick={() => handleOpen(popupFile)} style={{ cursor: "pointer", marginBottom: "0.3rem" }}>Open</div>
                    <div onClick={() => handleErase(popupFile)} style={{ cursor: "pointer" }}>Delete</div>
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
