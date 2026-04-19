import HabitPatternCard from "../components/HabitPatternCard";

const MOOD_LABEL = {
  HAPPY: "Happy", NEUTRAL: "Neutral",
  TIRED: "Tired", FRUSTRATED: "Frustrated",
};

export default function AnalyticsPage({ stats, activities }) {
  if (!stats || !activities.length) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>-</div>
        <p>No data yet. Log some activities to see your analytics.</p>
      </div>
    );
  }

  // Mood vs problems from session-level data
  const moodProblems = activities.reduce((acc, a) => {
    if (a.mood) {
      if (!acc[a.mood]) acc[a.mood] = { total: 0, count: 0 };
      acc[a.mood].total += a.problemsSolved || 0;
      acc[a.mood].count += 1;
    }
    return acc;
  }, {});

  const moodRanking = Object.entries(moodProblems)
    .map(([mood, v]) => ({ mood, avg: v.count > 0 ? v.total / v.count : 0 }))
    .sort((a, b) => b.avg - a.avg);

  const verifiedCount = activities.filter(
    (a) => a.proofLink && a.proofLink.trim()
  ).length;

  // Tag analysis from stats
  const topTags   = stats.topTags  || {};
  const tagEntries = Object.entries(topTags);
  const maxTagVal  = tagEntries.length ? Math.max(...tagEntries.map(([, v]) => v)) : 1;

  const cardStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius, 14px)",
    padding: "1.4rem",
  };

  const titleStyle = {
    fontSize: "0.75rem", color: "var(--muted)",
    textTransform: "uppercase", letterSpacing: "0.08em",
    fontWeight: 700, marginBottom: "0.9rem",
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 800 }}>Analytics</h2>
      </div>

      {/* Top metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
        gap: "1rem", marginBottom: "1.5rem",
      }}>
        {[
          { label: "Efficiency",   value: `${stats.efficiency}`,         unit: "problems / hr",  color: "#43e97b" },
          { label: "Proof Rate",   value: `${stats.proofRate}%`,         unit: "sessions verified", color: "var(--cyan, #00d4ff)" },
          { label: "Best Day",     value: stats.bestDay,                  unit: "most problems",  color: "var(--accent, #6c63ff)" },
          { label: "Consistency",  value: `${stats.consistencyScore}%`,  unit: `Grade ${stats.consistencyGrade}`, color: "#ffd700" },
        ].map((item) => (
          <div key={item.label} style={cardStyle}>
            <div style={titleStyle}>{item.label}</div>
            <div style={{
              fontSize: "2rem", fontWeight: 900,
              fontFamily: "JetBrains Mono, monospace",
              color: item.color, lineHeight: 1,
            }}>
              {item.value}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.3rem" }}>
              {item.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Difficulty breakdown */}
      <div style={{ ...cardStyle, marginBottom: "1rem" }}>
        <div style={titleStyle}>Difficulty Breakdown</div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Easy",   value: stats.easyCount   || 0, color: "#43e97b" },
            { label: "Medium", value: stats.mediumCount || 0, color: "#ffd700" },
            { label: "Hard",   value: stats.hardCount   || 0, color: "#ff6584" },
          ].map((item) => {
            const total = (stats.easyCount || 0) + (stats.mediumCount || 0) + (stats.hardCount || 0);
            const pct   = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.label} style={{ flex: 1, minWidth: "100px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.82rem", color: item.color, fontWeight: 700 }}>{item.label}</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--muted)", fontFamily: "JetBrains Mono, monospace" }}>
                    {item.value} ({pct}%)
                  </span>
                </div>
                <div style={{ background: "var(--surface3, #1e1e32)", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "999px",
                    background: item.color,
                    width: `${pct}%`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tag analysis */}
      {tagEntries.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: "1rem" }}>
          <div style={titleStyle}>Top Topics Practiced</div>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1rem" }}>
            Based on tags you added to individual problems
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {tagEntries.map(([tag, count]) => (
              <div key={tag} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{
                  width: "110px", fontSize: "0.82rem", color: "var(--text)",
                  fontWeight: 600, flexShrink: 0,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {tag}
                </span>
                <div style={{ flex: 1, background: "var(--surface3, #1e1e32)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "999px",
                    background: "linear-gradient(90deg, #6c63ff, #00d4ff)",
                    width: `${(count / maxTagVal) * 100}%`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <span style={{
                  fontSize: "0.78rem", color: "var(--muted)",
                  fontFamily: "JetBrains Mono, monospace",
                  width: "32px", textAlign: "right", flexShrink: 0,
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
          {tagEntries.length > 0 && (
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "0.9rem" }}>
              Your most practiced topic is <strong style={{ color: "var(--accent)" }}>{tagEntries[0][0]}</strong>.
              {tagEntries.length >= 3 && (
                <> Focus more on <strong style={{ color: "var(--accent2, #ff6584)" }}>{tagEntries[tagEntries.length - 1][0]}</strong> to become well-rounded.</>
              )}
            </p>
          )}
        </div>
      )}

      {/* Habit Pattern Card */}
      <HabitPatternCard
        codingTime={stats.codingTime}
        codingPattern={stats.codingPattern}
        habitInsight={stats.habitInsight}
        dayOfWeekMap={stats.dayOfWeekMap}
        bestDay={stats.bestDay}
      />

      {/* Proof rate */}
      <div style={{ ...cardStyle, marginBottom: "1rem" }}>
        <div style={titleStyle}>Proof Verification Rate</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
          <span>Verified sessions</span>
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>{stats.proofRate}%</span>
        </div>
        <div style={{ background: "var(--surface3, #1e1e32)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: "999px",
            background: "linear-gradient(90deg, #6c63ff, #00d4ff)",
            width: `${stats.proofRate}%`, transition: "width 0.8s ease",
          }} />
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "0.6rem" }}>
          {stats.proofRate >= 80
            ? "Excellent. Your streak data is highly trustworthy."
            : stats.proofRate >= 50
            ? "Good. Try adding problem links for more sessions."
            : "Adding proof links makes your profile credible to interviewers and reviewers."}
        </p>
      </div>

      {/* Mood vs performance */}
      {moodRanking.length > 0 && (
        <div style={cardStyle}>
          <div style={titleStyle}>Mood vs Performance</div>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1rem" }}>
            Average problems solved per session by mood
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {moodRanking.map(({ mood, avg }, i) => {
              const maxAvg = moodRanking[0].avg || 1;
              return (
                <div key={mood} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{
                    width: "85px", fontSize: "0.82rem",
                    color: i === 0 ? "var(--accent3, #43e97b)" : "var(--muted)",
                    fontWeight: i === 0 ? 700 : 400, flexShrink: 0,
                  }}>
                    {MOOD_LABEL[mood] || mood}
                  </span>
                  <div style={{ flex: 1, background: "var(--surface3, #1e1e32)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "999px",
                      background: i === 0 ? "#43e97b" : "var(--surface2, #161625)",
                      width: `${(avg / maxAvg) * 100}%`,
                      transition: "width 0.6s ease",
                      border: "1px solid var(--border)",
                    }} />
                  </div>
                  <span style={{
                    fontSize: "0.78rem", color: "var(--muted)",
                    fontFamily: "JetBrains Mono, monospace",
                    width: "36px", textAlign: "right", flexShrink: 0,
                  }}>
                    {avg.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
          {moodRanking[0] && (
            <p style={{ fontSize: "0.82rem", color: "var(--accent3, #43e97b)", marginTop: "0.9rem", fontWeight: 600 }}>
              You solve the most problems when feeling {(MOOD_LABEL[moodRanking[0].mood] || moodRanking[0].mood).toLowerCase()}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}