export default function ConsistencyRing({ score, grade, message, proofRate, bestDay }) {
  const radius       = 38;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference - (score / 100) * circumference;

  const gradeColor = {
    S: "#ffd700", A: "#43e97b", B: "#00d4ff",
    C: "#6c63ff", D: "#ff6584", "N/A": "var(--muted)",
  }[grade] || "var(--muted)";

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "14px", padding: "1.5rem",
      display: "flex", alignItems: "center", gap: "1.75rem",
      marginBottom: "1.5rem",
    }}>
      <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6c63ff" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--surface3, #1e1e32)" strokeWidth="9" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke="url(#ringGrad)"
            strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 900, fontFamily: "JetBrains Mono, monospace", color: "var(--text)" }}>
            {score}%
          </span>
          <span style={{ fontSize: "0.6rem", color: "var(--muted)" }}>score</span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{
            fontSize: "0.72rem", fontWeight: 800, fontFamily: "JetBrains Mono, monospace",
            background: "var(--surface2)", border: `1px solid ${gradeColor}`,
            color: gradeColor, padding: "0.15rem 0.5rem", borderRadius: "6px",
          }}>
            Grade {grade}
          </span>
          <span style={{ fontSize: "1rem", fontWeight: 700 }}>Consistency Score</span>
        </div>
        <p style={{ fontSize: "0.86rem", color: "var(--muted)", lineHeight: 1.55, marginBottom: "0.5rem" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--accent3, #43e97b)" }}>Best day: {bestDay}</span>
          <span style={{ fontSize: "0.78rem", color: "var(--cyan, #00d4ff)" }}>{proofRate}% sessions verified</span>
        </div>
        <div style={{ marginTop: "0.6rem", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "JetBrains Mono, monospace" }}>
          Formula: (weighted active days / total days) x 100 — Easy=1, Medium=2, Hard=3
        </div>
      </div>
    </div>
  );
}