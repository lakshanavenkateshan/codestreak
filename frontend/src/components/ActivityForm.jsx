import { useState } from "react";
import { API, authHeaders } from "../api";

const PLATFORMS   = ["LeetCode", "HackerRank", "Codeforces", "GeeksForGeeks", "CodeChef", "GitHub", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Mixed"];
const MOODS = [
  { value: "HAPPY",      label: "Happy" },
  { value: "NEUTRAL",    label: "Neutral" },
  { value: "TIRED",      label: "Tired" },
  { value: "FRUSTRATED", label: "Frustrated" },
];

export default function ActivityForm({ userId, token, onSuccess }) {
  const [form, setForm] = useState({
    platform:         "LeetCode",
    problemsSolved:   1,
    difficulty:       "Medium",
    timeSpentMinutes: 30,
    notes:            "",
    proofLink:        "",
    proofType:        "LINK",
    mood:             "NEUTRAL",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/activities`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body:    JSON.stringify({ ...form, userId }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to log activity");
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    fontSize: "0.75rem", fontWeight: 700,
    color: "var(--muted)", textTransform: "uppercase",
    letterSpacing: "0.08em", display: "block", marginBottom: "0.3rem",
  };

  const sectionStyle = {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1rem",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.25rem" }}>
        Log Today's Coding
      </h3>

      {/* Row 1: Platform + Difficulty */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <div>
          <label style={labelStyle}>Platform</label>
          <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Difficulty</label>
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Row 2: Problems + Time */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <div>
          <label style={labelStyle}>Problems Solved</label>
          <input
            type="number" min="0"
            value={form.problemsSolved}
            onChange={(e) => setForm({ ...form, problemsSolved: +e.target.value })}
          />
        </div>
        <div>
          <label style={labelStyle}>Time (minutes)</label>
          <input
            type="number" min="1"
            value={form.timeSpentMinutes}
            onChange={(e) => setForm({ ...form, timeSpentMinutes: +e.target.value })}
          />
        </div>
      </div>

      {/* Proof section */}
      <div style={sectionStyle}>
        <div style={{
          fontSize: "0.72rem", fontWeight: 800, color: "var(--accent)",
          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem",
        }}>
          Proof of Work — makes your streak verifiable
        </div>
        <label style={labelStyle}>Proof Type</label>
        <select
          value={form.proofType}
          onChange={(e) => setForm({ ...form, proofType: e.target.value })}
          style={{ marginBottom: "0.7rem" }}
        >
          <option value="LINK">Problem or GitHub Link</option>
          <option value="SCREENSHOT">Screenshot URL</option>
        </select>
        <label style={labelStyle}>
          {form.proofType === "LINK" ? "Paste link (LeetCode / GitHub / CodeChef)" : "Screenshot URL"}
        </label>
        <input
          type="url"
          placeholder={
            form.proofType === "LINK"
              ? "https://leetcode.com/problems/..."
              : "https://imgur.com/..."
          }
          value={form.proofLink}
          onChange={(e) => setForm({ ...form, proofLink: e.target.value })}
        />
      </div>

      {/* Mood */}
      <div>
        <label style={labelStyle}>How are you feeling right now?</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setForm({ ...form, mood: m.value })}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "var(--radius)",
                border: form.mood === m.value
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
                background: form.mood === m.value
                  ? "rgba(108,99,255,0.15)"
                  : "var(--surface2)",
                color: form.mood === m.value ? "var(--text)" : "var(--muted)",
                cursor: "pointer",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                transition: "all 0.15s",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label style={labelStyle}>Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="What did you work on? Any blockers?"
          rows={2}
          style={{ resize: "vertical" }}
        />
      </div>

      {error && <p style={{ color: "var(--accent2)", fontSize: "0.85rem" }}>{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save Activity"}
      </button>
    </form>
  );
}