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

export default function ProblemsPage({ activities }) {
  const [search,         setSearch]         = useState("");
  const [filterDiff,     setFilterDiff]     = useState("All");
  const [filterStatus,   setFilterStatus]   = useState("All");
  const [filterTag,      setFilterTag]      = useState("All");

  // Extract all problems from all sessions
  const allProblems = activities.flatMap((session) =>
    (session.problems || []).map((p) => ({
      ...p,
      sessionDate: session.date,
    }))
  );

  // Collect all unique tags
  const allTags = ["All", ...new Set(
    allProblems.flatMap((p) =>
      p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : []
    )
  )];

  // Filter
  const filtered = allProblems.filter((p) => {
    const matchSearch = !search ||
      (p.problemName && p.problemName.toLowerCase().includes(search.toLowerCase())) ||
      (p.tags && p.tags.toLowerCase().includes(search.toLowerCase()));
    const matchDiff   = filterDiff   === "All" || p.difficulty === filterDiff;
    const matchStatus = filterStatus === "All" || p.status     === filterStatus;
    const matchTag    = filterTag    === "All" ||
      (p.tags && p.tags.split(",").map((t) => t.trim()).includes(filterTag));
    return matchSearch && matchDiff && matchStatus && matchTag;
  });

  // Stats
  const solved    = allProblems.filter((p) => p.status === "SOLVED").length;
  const attempted = allProblems.filter((p) => p.status === "ATTEMPTED").length;
  const revisit   = allProblems.filter((p) => p.status === "REVISIT").length;
  const easy      = allProblems.filter((p) => p.difficulty === "Easy").length;
  const medium    = allProblems.filter((p) => p.difficulty === "Medium").length;
  const hard      = allProblems.filter((p) => p.difficulty === "Hard").length;

  const inputStyle = {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "0.6rem 0.9rem",
    borderRadius: "10px",
    fontFamily: "Outfit, sans-serif",
    fontSize: "0.88rem",
  };

  const labelStyle = {
    fontSize: "0.7rem", fontWeight: 700,
    color: "var(--muted)", textTransform: "uppercase",
    letterSpacing: "0.08em", display: "block",
    marginBottom: "0.25rem",
  };

  if (!allProblems.length) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>-</div>
        <p>No problems logged yet.</p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
          Log a session with multiple problems to see them here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 800 }}>Problems</h2>
        <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          {allProblems.length} total
        </span>
      </div>

      {/* Summary stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
        gap: "0.7rem", marginBottom: "1.5rem",
      }}>
        {[
          { label: "Solved",    value: solved,    color: "#43e97b" },
          { label: "Attempted", value: attempted, color: "#ffd700" },
          { label: "Revisit",   value: revisit,   color: "#ff6584" },
          { label: "Easy",      value: easy,      color: "#43e97b" },
          { label: "Medium",    value: medium,    color: "#ffd700" },
          { label: "Hard",      value: hard,      color: "#ff6584" },
        ].map((item) => (
          <div key={item.label} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "0.75rem",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "1.4rem", fontWeight: 900,
              fontFamily: "JetBrains Mono, monospace",
              color: item.color,
            }}>
              {item.value}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.15rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: "0.7rem", marginBottom: "1.25rem",
      }}>
        <div>
          <label style={labelStyle}>Search</label>
          <input
            style={{ ...inputStyle, width: "100%" }}
            placeholder="Search by name or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Difficulty</label>
          <select style={{ ...inputStyle, width: "100%" }}
            value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)}>
            {["All", "Easy", "Medium", "Hard"].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={{ ...inputStyle, width: "100%" }}
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {["All", "SOLVED", "ATTEMPTED", "REVISIT"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Tag</label>
          <select style={{ ...inputStyle, width: "100%" }}
            value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
            {allTags.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1rem" }}>
        Showing {filtered.length} of {allProblems.length} problems
      </p>

      {/* Problem list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {[...filtered].reverse().map((prob, idx) => {
          const diffStyle   = DIFF_COLOR[prob.difficulty]  || DIFF_COLOR.Medium;
          const statusStyle = STATUS_COLOR[prob.status]    || STATUS_COLOR.SOLVED;
          const tags        = prob.tags
            ? prob.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [];

          return (
            <div
              key={idx}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1rem 1.2rem",
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap" }}>
                {/* Name */}
                <div style={{ flex: 1, minWidth: "150px" }}>
                  {prob.problemLink ? (
                    <a
                      href={prob.problemLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "0.95rem", fontWeight: 700,
                        color: "var(--accent)", textDecoration: "none",
                      }}
                    >
                      {prob.problemName || "Unnamed"}
                    </a>
                  ) : (
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>
                      {prob.problemName || "Unnamed"}
                    </span>
                  )}
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.15rem", fontFamily: "JetBrains Mono, monospace" }}>
                    {new Date(prob.sessionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {" "}&middot;{" "}{prob.platform}
                    {" "}&middot;{" "}{prob.timeSpentMinutes} min
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ background: diffStyle.bg, color: diffStyle.color, padding: "0.15rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                    {prob.difficulty}
                  </span>
                  <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "0.15rem 0.5rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
                    {prob.status}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => setFilterTag(tag)}
                      style={{
                        background: "rgba(0,212,255,0.07)",
                        color: "var(--cyan, #00d4ff)",
                        border: "1px solid rgba(0,212,255,0.2)",
                        padding: "0.1rem 0.45rem",
                        borderRadius: "5px",
                        fontSize: "0.7rem", fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Notes */}
              {prob.notes && (
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                  {prob.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}