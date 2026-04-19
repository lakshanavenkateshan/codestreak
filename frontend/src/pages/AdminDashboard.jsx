import { useState, useEffect } from "react";
import { API, authHeaders } from "../api";

// ── Helpers ───────────────────────────────────────
const DIFF_STYLE = {
  Easy:   { bg: "rgba(22,163,74,0.1)",   color: "#16a34a" },
  Medium: { bg: "rgba(217,119,6,0.1)",   color: "#d97706" },
  Hard:   { bg: "rgba(220,38,38,0.1)",   color: "#dc2626" },
};

function fmt(date) {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return "Never";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

// ── Small metric card ────────────────────────────
function MetricCard({ label, value, sub, color, border }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid ${border || "var(--border)"}`,
      borderTop: `3px solid ${color || "var(--btn-color)"}`,
      borderRadius: "var(--radius)",
      padding: "1.1rem 1.25rem",
      flex: 1, minWidth: "130px",
    }}>
      <div style={{
        fontSize: "1.8rem", fontWeight: 700,
        fontFamily: "JetBrains Mono, monospace",
        color: color || "var(--text-color)",
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: "0.72rem", color: "var(--text-muted)",
        fontWeight: 600, textTransform: "uppercase",
        letterSpacing: "0.06em", marginTop: "0.35rem",
      }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ── Streak bar visualisation ─────────────────────
function StreakBar({ current, longest }) {
  const pct = longest > 0 ? Math.round((current / longest) * 100) : 0;
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
        <span>Current {current}d</span>
        <span>Best {longest}d</span>
      </div>
      <div style={{ background: "var(--bg-tertiary)", borderRadius: "999px",
        height: "6px", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: "999px",
          background: current > 0 ? "var(--btn-color)" : "var(--border)",
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}

// ── User detail view ─────────────────────────────
function UserDetail({ userId, token, onBack }) {
  const [data, setData] = useState(null);
  const [tab,  setTab]  = useState("sessions");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/users/${userId}`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
      Loading user data...
    </div>
  );

  if (!data || data.error) return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <p style={{ color: "var(--danger)" }}>Failed to load user data.</p>
      <button onClick={onBack} className="btn-primary" style={{ marginTop: "1rem" }}>
        Go Back
      </button>
    </div>
  );

  const totalProbs = data.totalProblems || 0;
  const easy       = data.easyCount   || 0;
  const medium     = data.mediumCount || 0;
  const hard       = data.hardCount   || 0;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem",
        marginBottom: "1.75rem", paddingRight: "3.5rem" }}>
        <button onClick={onBack} style={{
          background: "var(--bg-secondary)", border: "1px solid var(--border)",
          color: "var(--text-muted)", padding: "0.42rem 0.9rem",
          borderRadius: "var(--radius)", cursor: "pointer",
          fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.82rem",
          transition: "all 0.2s",
        }}>
          Back to Users
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "42px", height: "42px", background: "var(--btn-color)",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1rem", fontWeight: 800, color: "#fff",
          }}>
            {data.username?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-color)" }}>
              {data.username}
            </h2>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {data.email}
            </span>
          </div>
        </div>
        {data.currentStreak > 0 && (
          <div style={{
            marginLeft: "auto",
            background: "rgba(37,99,235,0.08)",
            border: "1px solid rgba(37,99,235,0.25)",
            borderRadius: "999px", padding: "0.3rem 0.85rem",
            fontSize: "0.82rem", fontWeight: 700, color: "var(--btn-color)",
          }}>
            {data.currentStreak} day streak
          </div>
        )}
      </div>

      {/* ── Metrics row ── */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <MetricCard label="Current Streak"  value={`${data.currentStreak}d`} color="var(--btn-color)" />
        <MetricCard label="Longest Streak"  value={`${data.longestStreak}d`} />
        <MetricCard label="Total Problems"  value={totalProbs} />
        <MetricCard label="Hours Coded"     value={`${data.totalHours || 0}h`} />
        <MetricCard label="Days Active"     value={data.totalDaysActive || 0} />
        <MetricCard label="Proof Rate"      value={`${data.proofRate || 0}%`}
          color={data.proofRate >= 70 ? "#16a34a" : "var(--warning)"} />
        <MetricCard label="Badges"          value={data.badges?.length || 0}
          color="#d97706" />
      </div>

      {/* ── Streak bar ── */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "1rem 1.25rem",
        marginBottom: "1.25rem",
      }}>
        <StreakBar current={data.currentStreak || 0} longest={data.longestStreak || 0} />
      </div>

      {/* ── Difficulty + Tags row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem",
        marginBottom: "1.25rem" }}>

        {/* Difficulty */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "1rem 1.25rem",
        }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.9rem" }}>
            Difficulty Breakdown
          </div>
          {[
            { label: "Easy",   val: easy,   color: "#16a34a" },
            { label: "Medium", val: medium, color: "#d97706" },
            { label: "Hard",   val: hard,   color: "#dc2626" },
          ].map((item) => {
            const pct = totalProbs > 0 ? Math.round((item.val / totalProbs) * 100) : 0;
            return (
              <div key={item.label} style={{ marginBottom: "0.6rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                  fontSize: "0.8rem", marginBottom: "0.2rem" }}>
                  <span style={{ color: item.color, fontWeight: 600 }}>{item.label}</span>
                  <span style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                    {item.val} ({pct}%)
                  </span>
                </div>
                <div style={{ background: "var(--bg-tertiary)", borderRadius: "999px",
                  height: "5px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: "999px",
                    background: item.color, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top tags */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "1rem 1.25rem",
        }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.9rem" }}>
            Top Topics
          </div>
          {data.topTags && Object.keys(data.topTags).length > 0 ? (
            Object.entries(data.topTags).map(([tag, count]) => {
              const maxCount = Math.max(...Object.values(data.topTags));
              return (
                <div key={tag} style={{ display: "flex", alignItems: "center",
                  gap: "0.6rem", marginBottom: "0.5rem" }}>
                  <span style={{ width: "80px", fontSize: "0.8rem", fontWeight: 600,
                    color: "var(--text-color)", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {tag}
                  </span>
                  <div style={{ flex: 1, background: "var(--bg-tertiary)",
                    borderRadius: "999px", height: "5px", overflow: "hidden" }}>
                    <div style={{
                      width: `${(count / maxCount) * 100}%`,
                      height: "100%", borderRadius: "999px",
                      background: "var(--btn-color)", transition: "width 0.6s ease",
                    }} />
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)",
                    fontFamily: "JetBrains Mono, monospace", width: "20px",
                    textAlign: "right", flexShrink: 0 }}>
                    {count}
                  </span>
                </div>
              );
            })
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No tags added yet.</p>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)",
        marginBottom: "1.25rem" }}>
        {["sessions", "badges"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "transparent", border: "none",
            borderBottom: tab === t ? "2px solid var(--btn-color)" : "2px solid transparent",
            color: tab === t ? "var(--btn-color)" : "var(--text-muted)",
            padding: "0.6rem 1.1rem", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.88rem",
            textTransform: "capitalize", transition: "all 0.2s",
          }}>
            {t === "sessions"
              ? `Sessions (${data.sessions?.length || 0})`
              : `Badges (${data.badges?.length || 0})`}
          </button>
        ))}
      </div>

      {/* ── SESSIONS ── */}
      {tab === "sessions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {(!data.sessions || data.sessions.length === 0) && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No sessions logged yet.
            </p>
          )}
          {[...(data.sessions || [])].reverse().map((session) => {
            const problems  = session.problems || [];
            const verified  = problems.filter((p) => p.problemLink?.trim()).length;
            return (
              <div key={session.id} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: verified > 0 ? "3px solid #16a34a" : "3px solid var(--border)",
                borderRadius: "var(--radius)", overflow: "hidden",
              }}>
                {/* Session header */}
                <div style={{
                  padding: "0.7rem 1rem",
                  background: "var(--bg-secondary)",
                  borderBottom: problems.length > 0 ? "1px solid var(--border)" : "none",
                  display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700,
                    color: "var(--text-color)", fontFamily: "JetBrains Mono, monospace" }}>
                    {fmt(session.date)}
                  </span>
                  {session.sessionLabel && (
                    <span style={{
                      fontSize: "0.63rem", fontWeight: 700, padding: "0.1rem 0.4rem",
                      borderRadius: "4px", border: "1px solid var(--border)",
                      background: "var(--bg-tertiary)", color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      {session.sessionLabel}
                    </span>
                  )}
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-color)" }}>
                    {problems.length} problem{problems.length !== 1 ? "s" : ""}
                  </span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {session.timeSpentMinutes} min
                  </span>
                  {session.mood && (
                    <span style={{
                      fontSize: "0.75rem", color: "var(--text-muted)",
                      background: "var(--bg-tertiary)", padding: "0.1rem 0.4rem",
                      borderRadius: "4px",
                    }}>
                      {session.mood.charAt(0) + session.mood.slice(1).toLowerCase()}
                    </span>
                  )}
                  <span style={{
                    marginLeft: "auto", fontSize: "0.7rem", fontWeight: 700,
                    color: verified > 0 ? "#16a34a" : "var(--danger)",
                  }}>
                    {verified > 0 ? `${verified}/${problems.length} verified` : "No proof"}
                  </span>
                </div>

                {/* Problems */}
                {problems.length > 0 && (
                  <div style={{ padding: "0.6rem 0.85rem",
                    display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {problems.map((p, i) => {
                      const dc   = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Medium;
                      const tags = p.tags
                        ? p.tags.split(",").map((t) => t.trim()).filter(Boolean)
                        : [];
                      return (
                        <div key={i} style={{
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border)",
                          borderRadius: "7px", padding: "0.55rem 0.85rem",
                        }}>
                          <div style={{ display: "flex", alignItems: "center",
                            gap: "0.5rem", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.88rem", fontWeight: 600,
                              color: "var(--text-color)", flex: 1, minWidth: "100px" }}>
                              {p.problemName || "Unnamed Problem"}
                            </span>
                            <span style={{
                              background: dc.bg, color: dc.color,
                              padding: "0.1rem 0.45rem", borderRadius: "4px",
                              fontSize: "0.72rem", fontWeight: 700,
                            }}>
                              {p.difficulty}
                            </span>
                            <span style={{
                              background: "var(--bg-tertiary)",
                              color: p.status === "SOLVED" ? "#16a34a" : "#d97706",
                              padding: "0.1rem 0.45rem", borderRadius: "4px",
                              fontSize: "0.7rem", fontWeight: 700,
                            }}>
                              {p.status}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {p.platform}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {p.timeSpentMinutes}m
                            </span>
                          </div>
                          {tags.length > 0 && (
                            <div style={{ display: "flex", gap: "0.3rem",
                              flexWrap: "wrap", marginTop: "0.35rem" }}>
                              {tags.map((tag) => (
                                <span key={tag} style={{
                                  background: "var(--bg-tertiary)",
                                  color: "var(--text-muted)",
                                  border: "1px solid var(--border)",
                                  padding: "0.06rem 0.38rem", borderRadius: "3px",
                                  fontSize: "0.67rem", fontWeight: 600,
                                }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {p.problemLink?.trim() && (
                            <div style={{ marginTop: "0.3rem", fontSize: "0.75rem" }}>
                              <a href={p.problemLink} target="_blank" rel="noopener noreferrer"
                                style={{ color: "var(--btn-color)" }}>
                                {p.problemLink.length > 55
                                  ? p.problemLink.slice(0, 55) + "..." : p.problemLink}
                              </a>
                            </div>
                          )}
                          {p.notes?.trim() && (
                            <div style={{
                              marginTop: "0.35rem", fontSize: "0.78rem",
                              color: "var(--text-muted)",
                              fontFamily: "JetBrains Mono, monospace",
                              background: "var(--surface)", border: "1px solid var(--border)",
                              borderRadius: "5px", padding: "0.45rem 0.6rem",
                              whiteSpace: "pre-wrap",
                            }}>
                              {p.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── BADGES ── */}
      {tab === "badges" && (
        <div>
          {(!data.badges || data.badges.length === 0) && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No badges earned yet.
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
            {(data.badges || []).map((b) => (
              <div key={b.id} style={{
                background: "var(--surface)",
                border: "1px solid var(--btn-color)",
                borderRadius: "var(--radius)",
                padding: "0.75rem 1rem",
                display: "flex", alignItems: "center", gap: "0.65rem",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "rgba(37,99,235,0.08)",
                  border: "2px solid var(--btn-color)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "0.78rem",
                  color: "var(--btn-color)",
                  fontFamily: "JetBrains Mono, monospace", flexShrink: 0,
                }}>
                  {b.badgeName?.charAt(0) || "B"}
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700,
                    color: "var(--text-color)" }}>
                    {b.badgeName}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {fmt(b.earnedOn)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Admin Dashboard ──────────────────────────
export default function AdminDashboard({ user, onLogout }) {
  const [overview,     setOverview]     = useState(null);
  const [users,        setUsers]        = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [sortBy,       setSortBy]       = useState("lastActive");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [ovRes, usRes] = await Promise.all([
        fetch(`${API}/admin/overview`, { headers: authHeaders(user.token) }),
        fetch(`${API}/admin/users`,    { headers: authHeaders(user.token) }),
      ]);
      if (!ovRes.ok || !usRes.ok) throw new Error("Fetch failed");
      setOverview(await ovRes.json());
      setUsers(await usRes.json());
    } catch {
      showToast("Failed to load admin data. Make sure you are logged in as admin.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`${API}/admin/users/${userId}`, {
        method: "DELETE", headers: authHeaders(user.token),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("User deleted.", "success");
        setDeleteTarget(null);
        load();
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch { showToast("Delete failed", "error"); }
  };

  // Filter + sort users
  const filtered = users
    .filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "streak")    return (b.currentStreak || 0) - (a.currentStreak || 0);
      if (sortBy === "problems")  return (b.totalProblems || 0) - (a.totalProblems || 0);
      if (sortBy === "badges")    return (b.badgeCount    || 0) - (a.badgeCount    || 0);
      if (sortBy === "lastActive") {
        if (!a.lastActive && !b.lastActive) return 0;
        if (!a.lastActive) return 1;
        if (!b.lastActive) return -1;
        return new Date(b.lastActive) - new Date(a.lastActive);
      }
      return 0;
    });

  // ── If user is selected, show detail view ──────
  if (selectedUser) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar user={user} onLogout={onLogout} />
        <main style={{ flex: 1, marginLeft: "215px", padding: "2rem 2.25rem",
          maxWidth: "calc(100vw - 215px)" }}>
          <UserDetail
            userId={selectedUser}
            token={user.token}
            onBack={() => setSelectedUser(null)}
          />
        </main>
        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar user={user} onLogout={onLogout} />

      <main style={{ flex: 1, marginLeft: "215px", padding: "2rem 2.25rem",
        maxWidth: "calc(100vw - 215px)" }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: "1.75rem", paddingRight: "3.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-color)",
            marginBottom: "0.25rem" }}>
            Admin Dashboard
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Monitor all registered users, their progress, and activity.
          </p>
        </div>

        {loading && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading data...</p>
        )}

        {/* ── Overview metrics ── */}
        {overview && (
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap",
            marginBottom: "1.75rem" }}>
            <MetricCard label="Total Users"
              value={overview.totalUsers}
              color="var(--btn-color)"
              sub="registered accounts" />
            <MetricCard label="Total Sessions"
              value={overview.totalSessions}
              sub="all time" />
            <MetricCard label="Problems Solved"
              value={overview.totalProblems}
              sub="across all users" />
            <MetricCard label="Badges Awarded"
              value={overview.totalBadges}
              color="#d97706"
              sub="total earned" />
            <MetricCard label="Active Today"
              value={overview.activeToday}
              color="#16a34a"
              sub="logged today" />
            <MetricCard label="Verified Sessions"
              value={overview.verifiedSessions}
              sub="have proof links" />
          </div>
        )}

        {/* ── Controls row ── */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem",
          flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label>Search Users</label>
            <input
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ minWidth: "160px" }}>
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="lastActive">Last Active</option>
              <option value="streak">Streak (High to Low)</option>
              <option value="problems">Problems (High to Low)</option>
              <option value="badges">Badges (High to Low)</option>
            </select>
          </div>
        </div>

        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
          Showing {filtered.length} of {users.length} users
        </p>

        {/* ── Users table ── */}
        {filtered.length === 0 && !loading && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)" }}>
              {users.length === 0
                ? "No users registered yet. Students need to register first."
                : "No users match your search."}
            </p>
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["User","Streak","Problems","Sessions","Last Active","Badges","Actions"]
                    .map((h) => (
                      <th key={h} style={{
                        padding: "0.75rem 1rem",
                        fontSize: "0.7rem", fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase", letterSpacing: "0.06em",
                        background: "var(--bg-secondary)",
                        borderBottom: "1px solid var(--border)",
                        textAlign: "left",
                      }}>
                        {h}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr key={u.id}
                    style={{ borderBottom: idx < filtered.length - 1 ? "1px solid var(--border)" : "none" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-secondary)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>

                    {/* User */}
                    <td style={{ padding: "0.82rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{
                          width: "30px", height: "30px", background: "var(--btn-color)",
                          borderRadius: "50%", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "0.65rem",
                          fontWeight: 800, color: "#fff", flexShrink: 0,
                        }}>
                          {u.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.88rem", fontWeight: 600,
                            color: "var(--text-color)" }}>
                            {u.username}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Streak */}
                    <td style={{ padding: "0.82rem 1rem" }}>
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontWeight: 700, fontSize: "0.88rem",
                        color: u.currentStreak > 0 ? "var(--btn-color)" : "var(--text-muted)",
                      }}>
                        {u.currentStreak}d
                      </span>
                    </td>

                    {/* Problems */}
                    <td style={{ padding: "0.82rem 1rem" }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace",
                        fontWeight: 600, fontSize: "0.88rem", color: "var(--text-color)" }}>
                        {u.totalProblems}
                      </span>
                    </td>

                    {/* Sessions */}
                    <td style={{ padding: "0.82rem 1rem" }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.88rem", color: "var(--text-muted)" }}>
                        {u.totalSessions}
                      </span>
                    </td>

                    {/* Last active */}
                    <td style={{ padding: "0.82rem 1rem", fontSize: "0.82rem",
                      color: "var(--text-muted)" }}>
                      {timeAgo(u.lastActive)}
                    </td>

                    {/* Badges */}
                    <td style={{ padding: "0.82rem 1rem" }}>
                      <span style={{
                        background: u.badgeCount > 0 ? "rgba(37,99,235,0.08)" : "var(--bg-tertiary)",
                        color: u.badgeCount > 0 ? "var(--btn-color)" : "var(--text-muted)",
                        border: `1px solid ${u.badgeCount > 0 ? "rgba(37,99,235,0.2)" : "var(--border)"}`,
                        padding: "0.1rem 0.5rem", borderRadius: "4px",
                        fontSize: "0.75rem", fontWeight: 700,
                      }}>
                        {u.badgeCount}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0.82rem 1rem" }}>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => setSelectedUser(u.id)}
                          style={{
                            background: "var(--btn-color)", color: "#fff",
                            border: "none", padding: "0.3rem 0.7rem",
                            borderRadius: "5px", cursor: "pointer",
                            fontSize: "0.78rem", fontWeight: 600,
                            fontFamily: "Inter, sans-serif",
                          }}>
                          View
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          style={{
                            background: "transparent", color: "var(--danger)",
                            border: "1px solid var(--danger)",
                            padding: "0.3rem 0.7rem", borderRadius: "5px",
                            cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                            fontFamily: "Inter, sans-serif",
                          }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Delete confirm modal ── */}
      {deleteTarget && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300,
        }}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border2)",
            borderRadius: "12px", padding: "1.75rem", maxWidth: "380px",
            width: "100%", boxShadow: "var(--shadow-lg)",
          }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.6rem",
              color: "var(--text-color)" }}>
              Delete User
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)",
              marginBottom: "1.25rem" }}>
              Delete <strong style={{ color: "var(--text-color)" }}>{deleteTarget.username}</strong>?
              This removes all their sessions, problems, badges and goals permanently.
            </p>
            <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteTarget(null)} style={{
                background: "transparent", border: "1px solid var(--border2)",
                color: "var(--text-muted)", padding: "0.5rem 1rem",
                borderRadius: "var(--radius)", cursor: "pointer",
                fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.88rem",
              }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteTarget.id)} style={{
                background: "var(--danger)", color: "#fff", border: "none",
                padding: "0.5rem 1rem", borderRadius: "var(--radius)",
                cursor: "pointer", fontFamily: "Inter, sans-serif",
                fontWeight: 600, fontSize: "0.88rem",
              }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

// ── Admin Sidebar ─────────────────────────────────
function Sidebar({ user, onLogout }) {
  return (
    <aside style={{
      width: "215px", background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      padding: "1.25rem 0.75rem",
      position: "fixed", height: "100vh", zIndex: 50,
      transition: "background 0.3s, border-color 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem",
        padding: "0.35rem 0.6rem", marginBottom: "1.75rem" }}>
        <div style={{
          width: "26px", height: "26px", background: "var(--btn-color)",
          borderRadius: "6px", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "0.82rem", fontWeight: 800, color: "#fff",
        }}>
          A
        </div>
        <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-color)" }}>
          Admin Panel
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          background: "rgba(37,99,235,0.07)",
          border: "1px solid rgba(37,99,235,0.2)",
          borderLeft: "3px solid var(--btn-color)",
          borderRadius: "0 var(--radius) var(--radius) 0",
          padding: "0.65rem 0.85rem",
          fontSize: "0.875rem", fontWeight: 600, color: "var(--btn-color)",
        }}>
          All Users
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.85rem" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.5rem 0.65rem", background: "var(--bg-secondary)",
          borderRadius: "var(--radius)", marginBottom: "0.5rem",
          border: "1px solid var(--border)",
        }}>
          <div style={{
            width: "24px", height: "24px", background: "var(--danger)",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "0.6rem", fontWeight: 800, color: "#fff",
          }}>
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <span style={{ fontSize: "0.83rem", fontWeight: 600,
            color: "var(--text-color)", flex: 1 }}>
            {user.username}
          </span>
          <span style={{
            fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.05em",
            background: "rgba(220,38,38,0.1)", color: "var(--danger)",
            border: "1px solid rgba(220,38,38,0.2)",
            padding: "0.1rem 0.35rem", borderRadius: "3px",
          }}>
            ADMIN
          </span>
        </div>
        <button onClick={onLogout} style={{
          width: "100%", background: "transparent",
          border: "1px solid var(--border)", color: "var(--text-muted)",
          padding: "0.5rem", borderRadius: "var(--radius)",
          cursor: "pointer", fontFamily: "Inter, sans-serif",
          fontSize: "0.83rem", fontWeight: 500, transition: "all 0.2s",
        }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}