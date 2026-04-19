export default function WeekChart({ activities }) {
  const days  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const today = new Date();

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d       = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayActs = activities.filter((a) => a.date === dateStr);
    const problems  = dayActs.reduce((sum, a) => sum + (a.problemsSolved || 0), 0);
    const hasProof  = dayActs.some((a) => a.proofLink && a.proofLink.trim() !== "");
    return { label: days[d.getDay()], problems, isToday: i === 6, hasProof };
  });

  const max = Math.max(...weekData.map((d) => d.problems), 1);

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
          This Week
        </span>
        <span style={{ fontSize: "0.72rem", color: "var(--accent3, #43e97b)" }}>
          VER = proof submitted
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "0.8rem", height: "120px" }}>
        {weekData.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
            {d.hasProof && (
              <span style={{ fontSize: "0.58rem", color: "var(--accent3, #43e97b)", fontWeight: 800 }}>VER</span>
            )}
            <div style={{ width: "100%", height: "88px", display: "flex", alignItems: "flex-end" }}>
              <div style={{
                width: "100%",
                height: `${Math.max((d.problems / max) * 100, d.problems > 0 ? 8 : 4)}%`,
                background: d.isToday
                  ? "linear-gradient(180deg, #6c63ff, #8b5cf6)"
                  : d.hasProof
                  ? "linear-gradient(180deg, rgba(67,233,123,0.5), rgba(67,233,123,0.25))"
                  : "var(--surface3, #1e1e32)",
                borderRadius: "5px 5px 0 0",
                border: d.isToday ? "1px solid #6c63ff" : "1px solid var(--border)",
                transition: "height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              title={`${d.problems} problems${d.hasProof ? " - verified" : ""}`}
              />
            </div>
            <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "JetBrains Mono, monospace" }}>
              {d.label}
            </span>
            <span style={{ fontSize: "0.68rem", color: d.isToday ? "var(--accent)" : "var(--muted)", fontWeight: 700, minHeight: "1rem" }}>
              {d.problems > 0 ? d.problems : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}