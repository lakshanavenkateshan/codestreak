import { useState, useEffect } from "react";

const BADGE_COLORS = {
  FIRST_FLAME:    "#ff6b35", WEEK_WARRIOR:   "#6c63ff",
  CONSISTENT_10:  "#00d4ff", FIFTY_DAYS:     "#ffd700",
  MONTH_MASTER:   "#43e97b", CENTURY_STREAK: "#ff6584",
  LEGEND:         "#ffd700", PROBLEM_50:     "#43e97b",
  CENTURY_CODER:  "#00d4ff", PROBLEM_200:    "#6c63ff",
  HARD_MODE:      "#ff6584", SPEED_CODER:    "#ffd700",
  PROOF_CHAMPION: "#43e97b", ACTIVE_30_DAYS: "#00d4ff",
  PROBLEM_HUNTER: "#6c63ff", ACTIVE_100_DAYS:"#ff6b35",
};

export default function BadgeToast({ newBadges = [], onDone }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(newBadges.length > 0);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      if (current < newBadges.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        setVisible(false);
        if (onDone) onDone();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [current, visible, newBadges.length]);

  if (!visible || newBadges.length === 0) return null;

  const badge = newBadges[current];
  const color = BADGE_COLORS[badge.badgeKey] || "#6c63ff";

  return (
    <div style={{
      position: "fixed",
      top: "1.5rem",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
      background: "var(--surface)",
      border: `1px solid ${color}`,
      borderRadius: "16px",
      padding: "1rem 1.5rem",
      boxShadow: `0 0 40px ${color}44, 0 12px 40px rgba(0,0,0,0.4)`,
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      minWidth: "280px",
      animation: "badge-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      <style>{`
        @keyframes badge-pop {
          from { transform: translateX(-50%) scale(0.6); opacity: 0; }
          to   { transform: translateX(-50%) scale(1);   opacity: 1; }
        }
      `}</style>

      {/* Badge icon */}
      <div style={{
        width: "44px", height: "44px", borderRadius: "50%",
        background: `${color}22`,
        border: `2px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 0 16px ${color}66`,
      }}>
        <span style={{
          fontSize: "1rem", fontWeight: 900,
          color: color,
          fontFamily: "JetBrains Mono, monospace",
        }}>
          {badge.badgeName ? badge.badgeName.charAt(0) : "B"}
        </span>
      </div>

      {/* Text */}
      <div>
        <div style={{
          fontSize: "0.68rem", fontWeight: 800,
          color: color, textTransform: "uppercase",
          letterSpacing: "0.1em", marginBottom: "0.2rem",
        }}>
          Badge Unlocked
        </div>
        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text)" }}>
          {badge.badgeName}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.1rem" }}>
          {badge.description}
        </div>
      </div>

      {/* Counter if multiple */}
      {newBadges.length > 1 && (
        <div style={{
          marginLeft: "auto", flexShrink: 0,
          fontSize: "0.72rem", color: "var(--muted)",
          fontFamily: "JetBrains Mono, monospace",
        }}>
          {current + 1}/{newBadges.length}
        </div>
      )}
    </div>
  );
}