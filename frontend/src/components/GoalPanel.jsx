import { useState, useEffect } from "react";
import { API, authHeaders } from "../api";

export default function GoalPanel({ userId, token, stats }) {
  const [goal,  setGoal]  = useState(null);
  const [form,  setForm]  = useState({ dailyProblemTarget: 3, weeklyProblemTarget: 15, dailyMinutesTarget: 60 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/goals/${userId}`, { headers: authHeaders(token) })
      .then((r) => (r.status === 204 ? null : r.json()))
      .then((data) => { if (data && data.id) { setGoal(data); setForm(data); } })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = goal ? "PUT" : "POST";
    const url    = goal ? `${API}/goals/${goal.id}` : `${API}/goals`;
    const res    = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...authHeaders(token) },
      body: JSON.stringify({ ...form, userId }),
    });
    const data = await res.json();
    setGoal(data); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const pct = (val, target) => Math.min(100, Math.round((val / target) * 100)) || 0;

  const inputStyle = {
    background: "var(--surface2)", border: "1px solid var(--border)",
    color: "var(--text)", padding: "0.7rem 0.9rem",
    borderRadius: "10px", fontFamily: "Outfit, sans-serif",
    fontSize: "0.9rem", width: "100%",
  };

  const labelStyle = {
    fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)",
    textTransform: "uppercase", letterSpacing: "0.08em",
    display: "block", marginBottom: "0.25rem",
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 800 }}>Goals</h2>
      </div>

      {goal && stats && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Daily Problems",   current: stats.todayProblems || 0, target: goal.dailyProblemTarget },
            { label: "Weekly Problems",  current: stats.weekProblems  || 0, target: goal.weeklyProblemTarget },
          ].map((item) => {
            const p = pct(item.current, item.target);
            return (
              <div key={item.label} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "12px", padding: "1.25rem",
              }}>
                <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>{item.label}</div>
                <div style={{ background: "var(--surface2)", borderRadius: "999px", height: "8px", marginBottom: "0.5rem", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "999px",
                    background: "linear-gradient(90deg, #6c63ff, #00d4ff)",
                    width: `${p}%`, transition: "width 0.5s ease",
                  }} />
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  {item.current} / {item.target}
                  <span style={{ marginLeft: "0.4rem", color: p >= 100 ? "var(--accent3, #43e97b)" : "var(--muted)" }}>
                    ({p}%)
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSave} style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "14px", padding: "1.75rem",
        display: "flex", flexDirection: "column", gap: "0.9rem",
      }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          {goal ? "Update Your Goals" : "Set Your Goals"}
        </h3>
        <div>
          <label style={labelStyle}>Daily Problem Target</label>
          <input type="number" min="1" style={inputStyle} value={form.dailyProblemTarget}
            onChange={(e) => setForm({ ...form, dailyProblemTarget: +e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Weekly Problem Target</label>
          <input type="number" min="1" style={inputStyle} value={form.weeklyProblemTarget}
            onChange={(e) => setForm({ ...form, weeklyProblemTarget: +e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Daily Minutes Target</label>
          <input type="number" min="1" style={inputStyle} value={form.dailyMinutesTarget}
            onChange={(e) => setForm({ ...form, dailyMinutesTarget: +e.target.value })} />
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: "0.25rem" }}>
          {saved ? "Saved" : "Save Goals"}
        </button>
      </form>
    </div>
  );
}