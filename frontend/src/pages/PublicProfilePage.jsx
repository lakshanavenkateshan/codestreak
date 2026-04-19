import { useState, useEffect } from "react";
import { API } from "../api";
import BadgesPanel from "../components/BadgesPanel";

const BADGE_COLORS = {
  FIRST_FLAME: "#ff6b35", WEEK_WARRIOR: "#6c63ff",
  MONTH_MASTER: "#43e97b", LEGEND: "#ffd700",
};

export default function PublicProfilePage({ username }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch(`${API}/stats/public/${username}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); }
        else            { setProfile(data); }
        setLoading(false);
      })
      .catch(() => { setError("Could not load profile."); setLoading(false); });
  }, [username]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)" }}>
      <p style={{ color: "var(--muted)" }}>Loading profile...</p>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)", flexDirection: "column", gap: "1rem" }}>
      <div style={{ fontSize: "2rem", color: "var(--muted)" }}>404</div>
      <p style={{ color: "var(--muted)" }}>{error}</p>
      <a href="/" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9rem" }}>
        Go to CodeStreak
      </a>
    </div>
  );

  const stats = [
    { label: "Current Streak",  value: `${profile.currentStreak} days`,  color: "var(--accent)" },
    { label: "Longest Streak",  value: `${profile.longestStreak} days`,  color: "var(--gold, #ffd700)" },
    { label: "Total Problems",  value: profile.totalProblems,            color: "var(--accent3, #43e97b)" },
    { label: "Total Hours",     value: `${profile.totalHours}h`,         color: "var(--cyan, #00d4ff)" },
    { label: "Consistency",     value: `${profile.consistencyScore}%`,   color: "var(--accent)" },
    { label: "Days Active",     value: profile.totalActiveDays || 0,     color: "var(--muted)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Hero banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(108,99,255,0.18) 0%, rgba(0,212,255,0.08) 100%)",
        borderBottom: "1px solid var(--border)",
        padding: "3rem 2rem 2.5rem",
        textAlign: "center",
      }}>
        {/* Avatar */}
        <div style={{
          width: "72px", height: "72px",
          background: "linear-gradient(135deg, #6c63ff, #00d4ff)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.8rem", fontWeight: 900, color: "white",
          margin: "0 auto 1rem",
          boxShadow: "0 0 30px rgba(108,99,255,0.4)",
        }}>
          {username.slice(0, 2).toUpperCase()}
        </div>

        <h1 style={{
          fontSize: "1.8rem", fontWeight: 900,
          background: "linear-gradient(135deg, #6c63ff, #00d4ff)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", marginBottom: "0.5rem",
        }}>
          {username}
        </h1>

        {/* Streak fire indicator */}
        {profile.currentStreak > 0 && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(108,99,255,0.12)",
            border: "1px solid rgba(108,99,255,0.3)",
            padding: "0.4rem 1rem", borderRadius: "999px",
            fontSize: "0.88rem", fontWeight: 700, color: "var(--accent)",
            marginBottom: "0.5rem",
          }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {profile.currentStreak}
            </span>
            day streak
          </div>
        )}

        {/* Grade badge */}
        {profile.consistencyGrade && profile.consistencyGrade !== "N/A" && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            marginLeft: "0.5rem",
            background: "rgba(255,215,0,0.1)",
            border: "1px solid rgba(255,215,0,0.35)",
            padding: "0.4rem 1rem", borderRadius: "999px",
            fontSize: "0.88rem", fontWeight: 800, color: "#ffd700",
          }}>
            Grade {profile.consistencyGrade}
          </div>
        )}

        {/* Habit insight */}
        {profile.habitInsight && (
          <p style={{
            fontSize: "0.88rem", color: "var(--muted)",
            marginTop: "0.75rem", maxWidth: "480px", margin: "0.75rem auto 0",
          }}>
            {profile.habitInsight}
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Stats grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.75rem",
          marginBottom: "1.75rem",
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1.1rem",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: "1.7rem", fontWeight: 900,
                fontFamily: "JetBrains Mono, monospace",
                color: s.color, lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: "0.7rem", color: "var(--muted)",
                textTransform: "uppercase", letterSpacing: "0.07em",
                fontWeight: 700, marginTop: "0.35rem",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <BadgesPanel badges={profile.badges || []} />

        {/* Top tags */}
        {profile.topTags && Object.keys(profile.topTags).length > 0 && (
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 14px)",
            padding: "1.4rem",
            marginBottom: "1.5rem",
          }}>
            <div style={{
              fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)",
              textTransform: "uppercase", letterSpacing: "0.09em",
              marginBottom: "1rem",
            }}>
              Top Topics
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {Object.entries(profile.topTags).map(([tag, count]) => (
                <span key={tag} style={{
                  background: "rgba(0,212,255,0.08)",
                  color: "var(--cyan, #00d4ff)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.82rem", fontWeight: 600,
                }}>
                  {tag} ({count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <a href="/" style={{
            fontSize: "0.82rem", color: "var(--muted)",
            textDecoration: "none",
          }}>
            Powered by CodeStreak
          </a>
        </div>
      </div>
    </div>
  );
}