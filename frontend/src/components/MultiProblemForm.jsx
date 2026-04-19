import { useState } from "react";
import { API, authHeaders } from "../api";
import { validateProblemLink, detectPlatform } from "../utils/linkValidator";

const PLATFORMS    = ["LeetCode","HackerRank","Codeforces","GeeksForGeeks","CodeChef","GitHub","AtCoder","InterviewBit","Other"];
const DIFFICULTIES = ["Easy","Medium","Hard"];
const STATUSES     = ["SOLVED","ATTEMPTED","REVISIT"];
const MOODS        = ["Happy","Neutral","Tired","Frustrated"];
const TAG_SUGGESTIONS = [
  "Arrays","HashMap","Sliding Window","Two Pointers",
  "Binary Search","DP","Recursion","Backtracking",
  "Graphs","BFS","DFS","Trees","Greedy",
  "Stacks","Queues","Linked List","Math","Strings",
];

function emptyProblem() {
  return {
    problemName: "", problemLink: "", platform: "LeetCode",
    difficulty: "Medium", timeSpentMinutes: 20,
    tags: "", notes: "", status: "SOLVED",
    linkError: "", linkValid: null,
  };
}

const inp = {
  background: "var(--surface2, #f8f9fa)",
  border: "1px solid var(--border, #e2e8f0)",
  color: "var(--text-color, #0f172a)",
  padding: "0.6rem 0.85rem",
  borderRadius: "var(--radius, 8px)",
  fontFamily: "Inter, sans-serif",
  fontSize: "0.88rem",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s",
};

const lbl = {
  fontSize: "0.72rem", fontWeight: 700,
  color: "var(--text-muted, #64748b)",
  textTransform: "uppercase", letterSpacing: "0.06em",
  display: "block", marginBottom: "0.25rem",
};

export default function MultiProblemForm({ userId, token, onSuccess }) {
  const [problems, setProblems] = useState([emptyProblem()]);
  const [mood,     setMood]     = useState("Neutral");
  const [notes,    setNotes]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const upd = (i, field, val) =>
    setProblems((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  // Validate link when user clicks out of the field
  const handleLinkBlur = (i) => {
    const link = problems[i].problemLink;
    if (!link.trim()) {
      upd(i, "linkError", "");
      upd(i, "linkValid", null);
      return;
    }
    const result = validateProblemLink(link);
    if (result.valid) {
      const detected = detectPlatform(link);
      setProblems((prev) => prev.map((p, idx) =>
        idx === i ? { ...p, linkError: "", linkValid: true, platform: detected || p.platform } : p
      ));
    } else {
      upd(i, "linkError", result.message);
      upd(i, "linkValid", false);
    }
  };

  const handleLinkChange = (i, val) => {
    setProblems((prev) => prev.map((p, idx) =>
      idx === i ? { ...p, problemLink: val, linkError: "", linkValid: null } : p
    ));
  };

  const addTag = (i, tag) => {
    const tags = problems[i].tags
      ? problems[i].tags.split(",").map((t) => t.trim())
      : [];
    if (!tags.includes(tag)) upd(i, "tags", [...tags, tag].join(", "));
  };

  const totalTime = problems.reduce((s, p) => s + (Number(p.timeSpentMinutes) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all links
    let hasError = false;
    const validated = problems.map((p) => {
      if (p.problemLink.trim()) {
        const r = validateProblemLink(p.problemLink);
        if (!r.valid) { hasError = true; return { ...p, linkError: r.message, linkValid: false }; }
        return { ...p, linkError: "", linkValid: true };
      }
      return p;
    });

    if (hasError) {
      setProblems(validated);
      setError("Fix the invalid problem links before saving.");
      return;
    }

    setLoading(true);
    try {
      const cleanProblems = problems.map(({ linkError, linkValid, ...rest }) => rest);
      const res = await fetch(`${API}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ userId, mood: mood.toUpperCase(), notes, problems: cleanProblems }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to log session");
      }
      onSuccess(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-color)" }}>Log Session</h3>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {problems.length} problem{problems.length !== 1 ? "s" : ""} — {totalTime} min
          </span>
        </div>
        <button type="button" onClick={() => setProblems((p) => [...p, emptyProblem()])} style={{
          background: "var(--surface2)", border: "1px solid var(--border2)",
          color: "var(--btn-color)", padding: "0.4rem 0.85rem",
          borderRadius: "var(--radius)", cursor: "pointer",
          fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.82rem",
        }}>
          + Add Problem
        </button>
      </div>

      {problems.map((problem, i) => (
        <div key={i} style={{
          background: "var(--bg-secondary)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "1rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <div style={{
                width: "20px", height: "20px", background: "var(--btn-color)",
                borderRadius: "4px", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "0.65rem", fontWeight: 800, color: "#fff",
              }}>{i + 1}</div>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-color)" }}>
                Problem {i + 1}
              </span>
            </div>
            {problems.length > 1 && (
              <button type="button"
                onClick={() => setProblems((p) => p.filter((_, idx) => idx !== i))}
                style={{
                  background: "transparent", border: "1px solid var(--danger)",
                  color: "var(--danger)", padding: "0.18rem 0.48rem",
                  borderRadius: "4px", cursor: "pointer",
                  fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 600,
                }}>
                Remove
              </button>
            )}
          </div>

          {/* Problem name */}
          <div style={{ marginBottom: "0.6rem" }}>
            <label style={lbl}>Problem Name</label>
            <input style={inp} placeholder="e.g. Two Sum"
              value={problem.problemName}
              onChange={(e) => upd(i, "problemName", e.target.value)} />
          </div>

          {/* ── Problem link with validation ── */}
          <div style={{ marginBottom: "0.6rem" }}>
            <label style={lbl}>
              Problem Link
              <span style={{
                fontWeight: 400, textTransform: "none",
                letterSpacing: 0, marginLeft: "0.4rem", fontSize: "0.68rem",
              }}>
                (optional — must be from LeetCode, HackerRank, GitHub, etc.)
              </span>
            </label>

            <div style={{ position: "relative" }}>
              <input
                style={{
                  ...inp,
                  borderColor:
                    problem.linkValid === false ? "var(--danger)" :
                    problem.linkValid === true  ? "var(--success)" :
                    "var(--border)",
                  paddingRight: problem.linkValid !== null ? "2.2rem" : "0.85rem",
                }}
                type="text"
                placeholder="https://leetcode.com/problems/two-sum"
                value={problem.problemLink}
                onChange={(e) => handleLinkChange(i, e.target.value)}
                onBlur={() => handleLinkBlur(i)}
              />
              {problem.linkValid === true && (
                <span style={{
                  position: "absolute", right: "0.7rem", top: "50%",
                  transform: "translateY(-50%)", color: "var(--success)",
                  fontSize: "0.9rem", fontWeight: 800, pointerEvents: "none",
                }}>✓</span>
              )}
              {problem.linkValid === false && (
                <span style={{
                  position: "absolute", right: "0.7rem", top: "50%",
                  transform: "translateY(-50%)", color: "var(--danger)",
                  fontSize: "0.9rem", fontWeight: 800, pointerEvents: "none",
                }}>✗</span>
              )}
            </div>

            {/* Error */}
            {problem.linkError && (
              <div style={{
                marginTop: "0.28rem", fontSize: "0.78rem",
                color: "var(--danger)", fontWeight: 500,
                display: "flex", gap: "0.3rem", alignItems: "flex-start",
              }}>
                <span>⚠</span><span>{problem.linkError}</span>
              </div>
            )}

            {/* Success */}
            {problem.linkValid === true && (
              <div style={{ marginTop: "0.28rem", fontSize: "0.75rem", color: "var(--success)" }}>
                Valid link — platform auto-detected.
              </div>
            )}

            {/* Hint when empty */}
            {!problem.problemLink && (
              <div style={{ marginTop: "0.25rem", fontSize: "0.7rem", color: "var(--text-light)" }}>
                Accepted: leetcode.com · hackerrank.com · codeforces.com · geeksforgeeks.org · github.com
              </div>
            )}
          </div>

          {/* Platform / Difficulty / Time / Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.6rem" }}>
            {[
              { label: "Platform",   field: "platform",         type: "select", opts: PLATFORMS    },
              { label: "Difficulty", field: "difficulty",       type: "select", opts: DIFFICULTIES },
              { label: "Time (min)", field: "timeSpentMinutes", type: "number"                     },
              { label: "Status",     field: "status",           type: "select", opts: STATUSES      },
            ].map(({ label, field, type, opts }) => (
              <div key={field}>
                <label style={lbl}>{label}</label>
                {type === "select" ? (
                  <select style={{ ...inp, padding: "0.52rem 0.5rem" }}
                    value={problem[field]}
                    onChange={(e) => upd(i, field, e.target.value)}>
                    {opts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input style={inp} type="number" min="1"
                    value={problem[field]}
                    onChange={(e) => upd(i, field, +e.target.value)} />
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: "0.6rem" }}>
            <label style={lbl}>Tags</label>
            <input style={inp} placeholder="e.g. Arrays, HashMap"
              value={problem.tags}
              onChange={(e) => upd(i, "tags", e.target.value)} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem", marginTop: "0.35rem" }}>
              {TAG_SUGGESTIONS.slice(0, 12).map((tag) => (
                <button key={tag} type="button" onClick={() => addTag(i, tag)} style={{
                  background: problem.tags.includes(tag) ? "rgba(37,99,235,0.08)" : "var(--surface)",
                  border: problem.tags.includes(tag) ? "1px solid rgba(37,99,235,0.3)" : "1px solid var(--border)",
                  color: problem.tags.includes(tag) ? "var(--btn-color)" : "var(--text-muted)",
                  padding: "0.1rem 0.38rem", borderRadius: "4px",
                  cursor: "pointer", fontSize: "0.67rem", fontWeight: 600,
                  fontFamily: "Inter, sans-serif", transition: "all 0.12s",
                }}>{tag}</button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={lbl}>Notes / Approach</label>
            <textarea style={{ ...inp, resize: "vertical", minHeight: "48px" }}
              placeholder="Approach, key insight, edge cases..."
              value={problem.notes}
              onChange={(e) => upd(i, "notes", e.target.value)}
              rows={2} />
          </div>
        </div>
      ))}

      {/* Session info */}
      <div style={{
        background: "var(--bg-secondary)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "1rem",
      }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--btn-color)",
          textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.7rem" }}>
          Session Info
        </div>
        <label style={lbl}>Mood</label>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
          {MOODS.map((m) => (
            <button key={m} type="button" onClick={() => setMood(m)} style={{
              padding: "0.32rem 0.72rem", borderRadius: "var(--radius)",
              border: mood === m ? "1px solid var(--btn-color)" : "1px solid var(--border)",
              background: mood === m ? "rgba(37,99,235,0.07)" : "var(--surface)",
              color: mood === m ? "var(--btn-color)" : "var(--text-muted)",
              cursor: "pointer", fontFamily: "Inter, sans-serif",
              fontWeight: 600, fontSize: "0.83rem", transition: "all 0.15s",
            }}>{m}</button>
          ))}
        </div>
        <label style={lbl}>Session Notes</label>
        <textarea style={{ ...inp, resize: "vertical", minHeight: "44px" }}
          placeholder="Overall thoughts..."
          value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </div>

      {error && (
        <div style={{
          background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.3)",
          borderRadius: "var(--radius)", padding: "0.65rem 0.9rem",
          fontSize: "0.84rem", color: "var(--danger)", fontWeight: 500,
        }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} style={{
        background: "var(--btn-color)", color: "#fff", border: "none",
        padding: "0.75rem 1.5rem", borderRadius: "var(--radius)",
        fontFamily: "Inter, sans-serif", fontSize: "0.95rem", fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
        transition: "background 0.2s",
      }}>
        {loading ? "Saving..." : `Save Session (${problems.length} problem${problems.length !== 1 ? "s" : ""})`}
      </button>
    </form>
  );
}