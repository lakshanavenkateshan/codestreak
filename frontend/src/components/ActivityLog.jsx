import { useState } from "react";

const DIFF_COLOR = {
  Easy:   { bg: "rgba(67,233,123,0.1)",  color: "#43e97b" },
  Medium: { bg: "rgba(255,215,0,0.1)",   color: "#ffd700" },
  Hard:   { bg: "rgba(255,101,132,0.1)", color: "#ff6584" },
};

const STATUS_COLOR = {
  SOLVED:    { bg: "rgba(67,233,123,0.1)",  color: "#43e97b" },
  ATTEMPTED: { bg: "rgba(255,215,0,0.1)",   color: "#ffd700" },
  REVISIT:   { bg: "rgba(255,101,132,0.1)", color: "#ff6584" },
};

const MOOD_LABEL = {
  HAPPY: "Happy", NEUTRAL: "Neutral",
  TIRED: "Tired", FRUSTRATED: "Frustrated",
};

const SESSION_LABEL_COLOR = {
  MORNING:   { color: "#ffd700", bg: "rgba(255,215,0,0.1)" },
  AFTERNOON: { color: "#ff6b35", bg: "rgba(255,107,53,0.1)" },
  EVENING:   { color: "#6c63ff", bg: "rgba(108,99,255,0.12)" },
  NIGHT:     { color: "#00d4ff", bg: "rgba(0,212,255,0.1)" },
  GENERAL:   { color: "var(--muted)", bg: "var(--surface3)" },
};

// Group sessions by date
function groupByDate(activities) {
  const groups = {};
  for (const session of [...activities].reverse()) {
    const d = session.date;
    if (!groups[d]) groups[d] = [];
    groups[d].push(session);
  }
  return Object.entries(groups);
}

function ProblemCard({ prob }) {
  const [expanded, setExpanded] = useState(false);
  const diffStyle   = DIFF_COLOR[prob.difficulty]  || DIFF_COLOR.Medium;
  const statusStyle = STATUS_COLOR[prob.status]    || STATUS_COLOR.SOLVED;
  const tags        = prob.tags
    ? prob.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div style={{
      background: "var(--surface2)",
      border: "1px solid var(--border)",
      borderRadius: "10px",
      overflow: "hidden",
      transition: "border-color 0.15s",
    }}>
      {/* Problem header — clickable */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          padding: "0.8rem 1rem",
          display: "flex", alignItems: "center",
          gap: "0.6rem", flexWrap: "wrap",
          cursor: "pointer",
        }}
      >
        {/* Expand indicator */}
        <span style={{
          fontSize: "0.6rem", color: "var(--muted)",
          transition: "transform 0.2s",
          display: "inline-block",
          transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        }}>
          &#9658;
        </span>

        {/* Name */}
        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", flex: 1, minWidth: "100px" }}>
          {prob.problemName || "Unnamed Problem"}
        </span>

        {/* Badges */}
        <span style={{ background: diffStyle.bg, color: diffStyle.color, padding: "0.12rem 0.5rem", borderRadius: "5px", fontSize: "0.72rem", fontWeight: 700 }}>
          {prob.difficulty}
        </span>
        <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "0.12rem 0.5rem", borderRadius: "5px", fontSize: "0.7rem", fontWeight: 700 }}>
          {prob.status}
        </span>
        <span style={{
          background: "rgba(108,99,255,0.12)", color: "var(--accent)",
          border: "1px solid rgba(108,99,255,0.25)",
          padding: "0.12rem 0.5rem", borderRadius: "5px", fontSize: "0.72rem", fontWeight: 700,
        }}>
          {prob.platform}
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
          {prob.timeSpentMinutes}m
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "0.85rem 1rem",
          background: "var(--surface3, #1e1e32)",
        }}>
          {/* Proof link */}
          {prob.problemLink && prob.problemLink.trim() && (
            <div style={{ marginBottom: "0.55rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Link
              </span>
              <div style={{ marginTop: "0.2rem" }}>
                <a
                  href={prob.problemLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)", fontSize: "0.82rem",
                    textDecoration: "none", wordBreak: "break-all",
                  }}
                >
                  {prob.problemLink}
                </a>
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ marginBottom: "0.55rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Topics
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.35rem" }}>
                {tags.map((tag) => (
                  <span key={tag} style={{
                    background: "rgba(0,212,255,0.07)", color: "var(--cyan, #00d4ff)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    padding: "0.1rem 0.45rem", borderRadius: "5px",
                    fontSize: "0.7rem", fontWeight: 600,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes — the solution journal */}
          {prob.notes && (
            <div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Notes / Solution Approach
              </span>
              <div style={{
                marginTop: "0.35rem",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.65rem 0.85rem",
                fontSize: "0.82rem",
                color: "var(--text)",
                lineHeight: 1.6,
                fontFamily: "JetBrains Mono, monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {prob.notes}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ActivityLog({ activities }) {
  if (!activities.length) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.4 }}>-</div>
        <p>No sessions logged yet.</p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
          Click Log Session to start your streak.
        </p>
      </div>
    );
  }

  const groups = groupByDate(activities);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {groups.map(([date, sessions]) => {
        const totalProblems = sessions.reduce((s, a) => s + (a.problemsSolved || 0), 0);
        const totalMinutes  = sessions.reduce((s, a) => s + (a.timeSpentMinutes || 0), 0);

        return (
          <div key={date}>
            {/* Date group header */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              marginBottom: "0.75rem",
            }}>
              <span style={{
                fontSize: "0.82rem", fontWeight: 700,
                color: "var(--text)",
                fontFamily: "JetBrains Mono, monospace",
              }}>
                {new Date(date).toLocaleDateString("en-IN", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                {totalProblems} problems &middot; {totalMinutes} min
              </span>
            </div>

            {/* Sessions for this date */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {sessions.map((session) => {
                const problems      = session.problems || [];
                const hasProof      = session.proofLink && session.proofLink.trim() !== "";
                const verifiedProbs = problems.filter((p) => p.problemLink && p.problemLink.trim()).length;
                const labelStyle    = SESSION_LABEL_COLOR[session.sessionLabel] || SESSION_LABEL_COLOR.GENERAL;

                return (
                  <div
                    key={session.id}
                    style={{
                      background: "var(--surface)",
                      border: verifiedProbs > 0
                        ? "1px solid rgba(67,233,123,0.25)"
                        : "1px solid var(--border)",
                      borderLeft: verifiedProbs > 0
                        ? "3px solid #43e97b"
                        : "3px solid var(--border)",
                      borderRadius: "14px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Session header */}
                    <div style={{
                      padding: "0.9rem 1.25rem",
                      borderBottom: problems.length > 0 ? "1px solid var(--border)" : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                      background: "var(--surface2)",
                    }}>
                      {/* Session label (MORNING / EVENING etc) */}
                      {session.sessionLabel && (
                        <span style={{
                          background: labelStyle.bg,
                          color: labelStyle.color,
                          padding: "0.15rem 0.6rem",
                          borderRadius: "6px",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}>
                          {session.sessionLabel}
                        </span>
                      )}

                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>
                        {problems.length} problem{problems.length !== 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                        {session.timeSpentMinutes} min
                      </span>
                      {session.mood && (
                        <span style={{
                          fontSize: "0.75rem", color: "var(--muted)",
                          background: "var(--surface3, #1e1e32)",
                          padding: "0.1rem 0.45rem", borderRadius: "6px",
                        }}>
                          {MOOD_LABEL[session.mood] || session.mood}
                        </span>
                      )}

                      {/* Proof summary */}
                      <div style={{ marginLeft: "auto" }}>
                        {verifiedProbs > 0 ? (
                          <span style={{
                            fontSize: "0.7rem", fontWeight: 800, color: "#43e97b",
                            background: "rgba(67,233,123,0.1)",
                            padding: "0.12rem 0.5rem", borderRadius: "6px",
                            border: "1px solid rgba(67,233,123,0.3)",
                          }}>
                            {verifiedProbs}/{problems.length} VERIFIED
                          </span>
                        ) : (
                          <span style={{
                            fontSize: "0.7rem", fontWeight: 700, color: "var(--accent2)",
                            background: "rgba(255,101,132,0.08)",
                            padding: "0.12rem 0.5rem", borderRadius: "6px",
                          }}>
                            NO PROOF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Problems list */}
                    {problems.length > 0 && (
                      <div style={{
                        padding: "0.75rem 1rem",
                        display: "flex", flexDirection: "column", gap: "0.5rem",
                      }}>
                        {problems.map((prob, idx) => (
                          <ProblemCard key={prob.id || idx} prob={prob} />
                        ))}
                      </div>
                    )}

                    {/* Session notes */}
                    {session.notes && (
                      <div style={{
                        padding: "0 1.25rem 0.85rem",
                        fontSize: "0.8rem", color: "var(--muted)",
                      }}>
                        {session.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}