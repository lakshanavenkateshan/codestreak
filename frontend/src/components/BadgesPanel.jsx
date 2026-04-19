// Badge metadata — key, icon, color
const BADGE_META = {
  FIRST_FLAME:     { icon: "F",  color: "#ff6b35", bg: "rgba(255,107,53,0.12)",  border: "rgba(255,107,53,0.35)" },
  WEEK_WARRIOR:    { icon: "7",  color: "#6c63ff", bg: "rgba(108,99,255,0.12)", border: "rgba(108,99,255,0.35)" },
  CONSISTENT_10:   { icon: "10", color: "#00d4ff", bg: "rgba(0,212,255,0.10)",  border: "rgba(0,212,255,0.3)"  },
  FIFTY_DAYS:      { icon: "50", color: "#ffd700", bg: "rgba(255,215,0,0.10)",  border: "rgba(255,215,0,0.3)"  },
  MONTH_MASTER:    { icon: "30", color: "#43e97b", bg: "rgba(67,233,123,0.10)", border: "rgba(67,233,123,0.3)" },
  CENTURY_STREAK:  { icon: "C",  color: "#ff6584", bg: "rgba(255,101,132,0.12)",border: "rgba(255,101,132,0.3)"},
  LEGEND:          { icon: "L",  color: "#ffd700", bg: "rgba(255,215,0,0.15)",  border: "rgba(255,215,0,0.5)"  },
  PROBLEM_50:      { icon: "P",  color: "#43e97b", bg: "rgba(67,233,123,0.10)", border: "rgba(67,233,123,0.3)" },
  CENTURY_CODER:   { icon: "1",  color: "#00d4ff", bg: "rgba(0,212,255,0.10)",  border: "rgba(0,212,255,0.3)"  },
  PROBLEM_200:     { icon: "2",  color: "#6c63ff", bg: "rgba(108,99,255,0.12)", border: "rgba(108,99,255,0.35)"},
  HARD_MODE:       { icon: "H",  color: "#ff6584", bg: "rgba(255,101,132,0.12)",border: "rgba(255,101,132,0.3)"},
  SPEED_CODER:     { icon: "S",  color: "#ffd700", bg: "rgba(255,215,0,0.12)",  border: "rgba(255,215,0,0.35)" },
  PROOF_CHAMPION:  { icon: "V",  color: "#43e97b", bg: "rgba(67,233,123,0.12)", border: "rgba(67,233,123,0.35)"},
  ACTIVE_30_DAYS:  { icon: "A",  color: "#00d4ff", bg: "rgba(0,212,255,0.10)",  border: "rgba(0,212,255,0.3)"  },
  ACTIVE_100_DAYS: { icon: "X",  color: "#ff6b35", bg: "rgba(255,107,53,0.12)", border: "rgba(255,107,53,0.35)"},
  PROBLEM_HUNTER:  { icon: "D",  color: "#6c63ff", bg: "rgba(108,99,255,0.12)", border: "rgba(108,99,255,0.35)"},
};

// All possible badges in order
const ALL_BADGES = [
  { key: "FIRST_FLAME",     name: "First Flame",       desc: "Logged your very first activity" },
  { key: "WEEK_WARRIOR",    name: "Week Warrior",       desc: "Achieved a 7-day coding streak" },
  { key: "CONSISTENT_10",   name: "10-Day Streak",      desc: "Maintained a 10-day streak" },
  { key: "MONTH_MASTER",    name: "Month Master",       desc: "Achieved a 30-day coding streak" },
  { key: "FIFTY_DAYS",      name: "50-Day Streak",      desc: "Maintained a 50-day streak" },
  { key: "CENTURY_STREAK",  name: "100-Day Streak",     desc: "Maintained a 100-day streak" },
  { key: "LEGEND",          name: "Legend",             desc: "Achieved a 365-day coding streak" },
  { key: "PROBLEM_50",      name: "50 Problems",        desc: "Solved 50 problems total" },
  { key: "CENTURY_CODER",   name: "Century Coder",      desc: "Solved 100 problems total" },
  { key: "PROBLEM_200",     name: "200 Problems",       desc: "Solved 200 problems total" },
  { key: "HARD_MODE",       name: "Hard Mode",          desc: "Solved 10 Hard difficulty problems" },
  { key: "SPEED_CODER",     name: "Speed Coder",        desc: "Solved 5+ problems in one session" },
  { key: "PROOF_CHAMPION",  name: "Proof Champion",     desc: "Submitted proof for 30 activities" },
  { key: "ACTIVE_30_DAYS",  name: "30 Days Active",     desc: "Active on 30 different days" },
  { key: "PROBLEM_HUNTER",  name: "Problem Hunter",     desc: "Active on 50 different days" },
  { key: "ACTIVE_100_DAYS", name: "100 Days Active",    desc: "Active on 100 different days" },
];

export default function BadgesPanel({ badges = [] }) {
  const earnedKeys = new Set(badges.map((b) => b.badgeKey));

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius, 14px)",
      padding: "1.5rem",
      marginBottom: "1.5rem",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "1.25rem",
      }}>
        <div style={{
          fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)",
          textTransform: "uppercase", letterSpacing: "0.09em",
        }}>
          Badges
        </div>
        <div style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem",
          color: "var(--accent)", fontWeight: 700,
        }}>
          {earnedKeys.size} / {ALL_BADGES.length}
        </div>
      </div>

      {/* Badge Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: "0.75rem",
      }}>
        {ALL_BADGES.map((badge) => {
          const earned = earnedKeys.has(badge.key);
          const meta   = BADGE_META[badge.key] || { icon: "?", color: "var(--muted)", bg: "var(--surface2)", border: "var(--border)" };
          const earnedBadge = badges.find((b) => b.badgeKey === badge.key);

          return (
            <div
              key={badge.key}
              title={earned
                ? `${badge.name}: ${badge.desc}${earnedBadge?.earnedOn ? `\nEarned: ${earnedBadge.earnedOn}` : ""}`
                : `Locked: ${badge.desc}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.75rem 0.4rem",
                borderRadius: "12px",
                background: earned ? meta.bg : "var(--surface2)",
                border: `1px solid ${earned ? meta.border : "var(--border)"}`,
                opacity: earned ? 1 : 0.38,
                transition: "all 0.2s",
                cursor: "default",
                position: "relative",
              }}
            >
              {/* Badge icon circle */}
              <div style={{
                width: "38px", height: "38px",
                borderRadius: "50%",
                background: earned
                  ? `linear-gradient(135deg, ${meta.color}55, ${meta.color}22)`
                  : "var(--surface3, #1e1e32)",
                border: `2px solid ${earned ? meta.color : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.85rem", fontWeight: 900,
                color: earned ? meta.color : "var(--muted)",
                fontFamily: "JetBrains Mono, monospace",
                boxShadow: earned ? `0 0 12px ${meta.color}44` : "none",
              }}>
                {meta.icon}
              </div>

              {/* Badge name */}
              <span style={{
                fontSize: "0.62rem", fontWeight: 700,
                color: earned ? "var(--text)" : "var(--muted)",
                textAlign: "center", lineHeight: 1.2,
                maxWidth: "68px", overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {badge.name}
              </span>

              {/* Earned dot */}
              {earned && (
                <div style={{
                  position: "absolute", top: "6px", right: "6px",
                  width: "7px", height: "7px",
                  borderRadius: "50%",
                  background: meta.color,
                  boxShadow: `0 0 6px ${meta.color}`,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {earnedKeys.size === 0 && (
        <p style={{
          fontSize: "0.85rem", color: "var(--muted)",
          textAlign: "center", marginTop: "0.5rem",
        }}>
          Log your first activity to start earning badges.
        </p>
      )}
    </div>
  );
}