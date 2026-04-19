export default function StreakRiskBanner({ riskLevel, riskMessage }) {
  if (!riskLevel || riskLevel === "NONE" || !riskMessage) return null;

  const styles = {
    HIGH:   { bg: "rgba(255,60,60,0.07)",  border: "rgba(255,60,60,0.4)",  color: "#ff6b6b",  tag: "STREAK AT RISK" },
    MEDIUM: { bg: "rgba(255,180,0,0.07)",  border: "rgba(255,180,0,0.4)",  color: "#ffb400",  tag: "REMINDER" },
    LOW:    { bg: "rgba(108,99,255,0.07)", border: "rgba(108,99,255,0.3)", color: "var(--accent, #6c63ff)", tag: "HEADS UP" },
  };

  const s = styles[riskLevel] || styles.LOW;

  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: "12px",
      padding: "0.9rem 1.25rem",
      marginBottom: "1.5rem",
      display: "flex", alignItems: "flex-start", gap: "0.9rem",
    }}>
      <span style={{
        background: `rgba(${s.color === "#ff6b6b" ? "255,107,107" : s.color === "#ffb400" ? "255,180,0" : "108,99,255"}, 0.15)`,
        color: s.color,
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.68rem", fontWeight: 700,
        padding: "0.2rem 0.5rem", borderRadius: "6px",
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap", marginTop: "0.1rem", flexShrink: 0,
      }}>
        {s.tag}
      </span>
      <p style={{ color: s.color, fontSize: "0.88rem", lineHeight: 1.5, fontWeight: 500 }}>
        {riskMessage}
      </p>
    </div>
  );
}