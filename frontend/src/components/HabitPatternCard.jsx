export default function HabitPatternCard({ codingTime, codingPattern, habitInsight, dayOfWeekMap, bestDay }) {
  if (!codingTime || codingTime === "Unknown" || codingTime === "Not enough data") {
    return (
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "14px", padding: "1.4rem", marginBottom: "1rem",
      }}>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.6rem" }}>
          Habit Pattern Detection
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
          Log at least 3 sessions to detect your coding habits.
        </p>
      </div>
    );
  }

  const dayEntries  = dayOfWeekMap ? Object.entries(dayOfWeekMap) : [];
  const maxVal      = Math.max(...dayEntries.map(([, v]) => v), 1);
  const timeLabel   = codingTime.split(" ")[0];

  const patternColor = {
    "Weekend Warrior":            "#6c63ff",
    "Weekday Grinder":            "#43e97b",
    "Consistent All-Week Coder":  "#00d4ff",
  }[codingPattern] || "#6c63ff";

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem",
    }}>
      <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "1.2rem" }}>
        Habit Pattern Detection
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
        <div style={{ background: "var(--surface2)", borderRadius: "12px", padding: "1rem", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Coding Time</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--accent, #6c63ff)" }}>{timeLabel}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.15rem" }}>
            {codingTime.replace(timeLabel + " ", "")}
          </div>
        </div>
        <div style={{ background: "var(--surface2)", borderRadius: "12px", padding: "1rem", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Pattern Type</div>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: patternColor }}>{codingPattern}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.15rem" }}>Best day: {bestDay}</div>
        </div>
      </div>

      {habitInsight && (
        <div style={{
          background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.2)",
          borderRadius: "10px", padding: "0.85rem 1rem",
          fontSize: "0.86rem", color: "var(--text)", lineHeight: 1.6, marginBottom: "1.2rem",
        }}>
          {habitInsight}
        </div>
      )}

      {dayEntries.length > 0 && (
        <>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.7rem" }}>
            Problems by Day of Week
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "70px" }}>
            {dayEntries.map(([day, val]) => (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                <div style={{ width: "100%", height: "52px", display: "flex", alignItems: "flex-end" }}>
                  <div style={{
                    width: "100%",
                    height: `${Math.max((val / maxVal) * 100, val > 0 ? 12 : 4)}%`,
                    background: day === bestDay ? "linear-gradient(180deg, #6c63ff, #8b5cf6)" : "var(--surface3, #1e1e32)",
                    borderRadius: "4px 4px 0 0", transition: "height 0.5s ease",
                  }} />
                </div>
                <span style={{ fontSize: "0.62rem", color: "var(--muted)", fontFamily: "JetBrains Mono, monospace" }}>{day}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}