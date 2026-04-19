import { useState, useEffect } from "react";
import { API, authHeaders }    from "../api";
import StatsCard               from "../components/StatsCard";
import MultiProblemForm        from "../components/MultiProblemForm";
import ActivityLog             from "../components/ActivityLog";
import GoalPanel               from "../components/GoalPanel";
import WeekChart               from "../components/WeekChart";
import ConsistencyRing         from "../components/ConsistencyRing";
import FreezePanel             from "../components/FreezePanel";
import StreakRiskBanner        from "../components/StreakRiskBanner";
import BadgesPanel             from "../components/BadgesPanel";
import BadgeToast              from "../components/BadgeToast";
import AnalyticsPage           from "./AnalyticsPage";
import ProblemsPage            from "./ProblemsPage";

export default function Dashboard({ user, onLogout }) {
  const [stats,      setStats]      = useState(null);
  const [activities, setActivities] = useState([]);
  const [showForm,   setShowForm]   = useState(false);
  const [tab,        setTab]        = useState("dashboard");
  const [toast,      setToast]      = useState(null);
  const [newBadges,  setNewBadges]  = useState([]);
  const [copied,     setCopied]     = useState(false);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/stats/${user.id}`, {
        headers: authHeaders(user.token),
      });
      const data = await res.json();
      setStats(data);
    } catch { /* silent */ }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API}/activities/${user.id}`, {
        headers: authHeaders(user.token),
      });
      setActivities(await res.json());
    } catch { /* silent */ }
  };

  useEffect(() => { fetchStats(); fetchActivities(); }, []);

  const handleSessionLogged = async (responseData) => {
    setShowForm(false);
    await fetchStats();
    await fetchActivities();
    // Show badge toast if any new badges were earned
    if (responseData?.newBadges?.length > 0) {
      setNewBadges(responseData.newBadges);
    } else {
      showToast("Session saved successfully.", "success");
    }
  };

  const handleFreezeUsed = (newCount) => {
    setStats((s) => s ? { ...s, freezeCount: newCount } : s);
    showToast("Freeze used. Streak protected.", "info");
  };

  const copyProfileLink = () => {
    const link = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const initials = user.username.slice(0, 2).toUpperCase();

  const NAV = [
    { id: "dashboard",  label: "Dashboard"  },
    { id: "activities", label: "Sessions"   },
    { id: "problems",   label: "Problems"   },
    { id: "analytics",  label: "Analytics"  },
    { id: "goals",      label: "Goals"      },
    { id: "badges",     label: "Badges"     },
  ];

  const modalStyle = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.78)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 200, padding: "1rem",
  };

  const modalInnerStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border2, #2e2e50)",
    borderRadius: "20px",
    padding: "2rem",
    width: "100%", maxWidth: "540px",
    position: "relative",
    maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 0 60px rgba(108,99,255,0.18)",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside style={{
        width: "240px",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        padding: "1.5rem 1rem",
        position: "fixed", height: "100vh", zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem", marginBottom: "2rem" }}>
          <div style={{
            width: "30px", height: "30px",
            background: "linear-gradient(135deg, #6c63ff, #00d4ff)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.9rem", fontWeight: 900, color: "white",
          }}>C</div>
          <span style={{
            fontSize: "1.15rem", fontWeight: 900,
            background: "linear-gradient(135deg, #6c63ff, #00d4ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>CodeStreak</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.22rem", flex: 1 }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              background: tab === n.id ? "rgba(108,99,255,0.14)" : "transparent",
              border: "none",
              borderLeft: tab === n.id ? "3px solid var(--accent, #6c63ff)" : "3px solid transparent",
              color: tab === n.id ? "var(--accent, #6c63ff)" : "var(--muted)",
              padding: "0.72rem 1rem",
              borderRadius: "0 12px 12px 0",
              textAlign: "left", cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.92rem", fontWeight: 600,
              transition: "all 0.15s",
            }}>
              {n.label}
              {n.id === "badges" && stats?.badges?.length > 0 && (
                <span style={{
                  marginLeft: "0.5rem", fontSize: "0.68rem",
                  background: "rgba(255,215,0,0.15)",
                  color: "var(--gold, #ffd700)",
                  padding: "0.1rem 0.35rem",
                  borderRadius: "4px", fontWeight: 800,
                }}>
                  {stats.badges.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            padding: "0.6rem 0.75rem",
            background: "var(--surface2)", borderRadius: "12px",
            marginBottom: "0.6rem",
          }}>
            <div style={{
              width: "28px", height: "28px",
              background: "linear-gradient(135deg, #6c63ff, #00d4ff)",
              borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.72rem", fontWeight: 800, color: "white",
            }}>{initials}</div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.username}
            </span>
          </div>

          {stats && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.42rem 0.75rem",
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: "10px", marginBottom: "0.6rem",
              fontSize: "0.78rem", color: "var(--cyan, #00d4ff)", fontWeight: 600,
            }}>
              <span>Freezes</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 800 }}>
                {stats.freezeCount ?? 0}
              </span>
            </div>
          )}

          {/* Share profile button */}
          <button
            onClick={copyProfileLink}
            style={{
              width: "100%", marginBottom: "0.5rem",
              background: "rgba(108,99,255,0.1)",
              border: "1px solid rgba(108,99,255,0.3)",
              color: "var(--accent)", padding: "0.52rem",
              borderRadius: "10px", cursor: "pointer",
              fontFamily: "Outfit, sans-serif", fontSize: "0.82rem",
              fontWeight: 700, transition: "all 0.15s",
            }}
          >
            {copied ? "Link Copied" : "Share Profile"}
          </button>

          <button onClick={onLogout} style={{
            width: "100%", background: "transparent",
            border: "1px solid var(--border)", color: "var(--muted)",
            padding: "0.52rem", borderRadius: "10px",
            cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: "0.85rem",
            transition: "all 0.15s",
          }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <main style={{ flex: 1, marginLeft: "240px", padding: "2rem 2.5rem", maxWidth: "calc(100vw - 240px)" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
                Welcome back, {user.username}
              </h2>
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                + Log Session
              </button>
            </div>

            {stats && <StreakRiskBanner riskLevel={stats.riskLevel} riskMessage={stats.riskMessage} />}

            {stats && (
              <div className="stats-grid">
                <StatsCard icon="*" label="Current Streak"  value={`${stats.currentStreak} days`} highlight />
                <StatsCard icon="*" label="Longest Streak"  value={`${stats.longestStreak} days`} />
                <StatsCard icon="*" label="Total Problems"  value={stats.totalProblems} />
                <StatsCard icon="*" label="Total Hours"     value={`${stats.totalHours}h`} />
              </div>
            )}

            {stats && (
              <ConsistencyRing
                score={stats.consistencyScore ?? 0}
                grade={stats.consistencyGrade ?? "N/A"}
                message={stats.consistencyMessage ?? ""}
                proofRate={stats.proofRate ?? 0}
                bestDay={stats.bestDay ?? "N/A"}
              />
            )}

            {stats && (
              <FreezePanel
                userId={user.id}
                token={user.token}
                freezeCount={stats.freezeCount ?? 0}
                currentStreak={stats.currentStreak ?? 0}
                nextFreezeIn={stats.nextFreezeIn ?? 7}
                onFreezeUsed={handleFreezeUsed}
              />
            )}

            <WeekChart activities={activities} />

            {/* Show badges preview on dashboard */}
            {stats?.badges?.length > 0 && (
              <BadgesPanel badges={stats.badges} />
            )}
          </>
        )}

        {/* SESSIONS */}
        {tab === "activities" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Sessions</h2>
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                + Log Session
              </button>
            </div>
            <ActivityLog activities={activities} />
          </>
        )}

        {/* PROBLEMS */}
        {tab === "problems" && (
          <ProblemsPage activities={activities} />
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <AnalyticsPage stats={stats} activities={activities} />
        )}

        {/* GOALS */}
        {tab === "goals" && (
          <GoalPanel userId={user.id} token={user.token} stats={stats} />
        )}

        {/* BADGES */}
        {tab === "badges" && (
          <div style={{ maxWidth: "760px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Badges</h2>
            </div>
            <BadgesPanel badges={stats?.badges || []} />
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius, 14px)", padding: "1.4rem",
            }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "0.75rem" }}>
                How to Earn Badges
              </div>
              {[
                ["First Flame",       "Log your very first activity"],
                ["Week Warrior",      "Maintain a 7-day streak"],
                ["10-Day Streak",     "Maintain a 10-day streak"],
                ["Month Master",      "Maintain a 30-day streak"],
                ["50-Day Streak",     "Maintain a 50-day streak"],
                ["100-Day Streak",    "Maintain a 100-day streak"],
                ["Legend",            "Maintain a 365-day streak"],
                ["50 Problems",       "Solve 50 total problems"],
                ["Century Coder",     "Solve 100 total problems"],
                ["200 Problems",      "Solve 200 total problems"],
                ["Hard Mode",         "Solve 10 Hard problems"],
                ["Speed Coder",       "Solve 5+ problems in one session"],
                ["Proof Champion",    "Submit proof for 30 activities"],
                ["30 Days Active",    "Be active on 30 different days"],
                ["Problem Hunter",    "Be active on 50 different days"],
                ["100 Days Active",   "Be active on 100 different days"],
              ].map(([name, desc]) => (
                <div key={name} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "0.85rem",
                }}>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{name}</span>
                  <span style={{ color: "var(--muted)" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Log form modal */}
        {showForm && (
          <div style={modalStyle}>
            <div style={modalInnerStyle}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  position: "absolute", top: "1rem", right: "1rem",
                  background: "var(--surface2)", border: "1px solid var(--border)",
                  color: "var(--muted)", width: "28px", height: "28px",
                  borderRadius: "50%", cursor: "pointer", fontSize: "0.85rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                x
              </button>
              <MultiProblemForm
                userId={user.id}
                token={user.token}
                onSuccess={handleSessionLogged}
              />
            </div>
          </div>
        )}
      </main>

      {/* Badge unlock toast */}
      {newBadges.length > 0 && (
        <BadgeToast
          newBadges={newBadges}
          onDone={() => {
            setNewBadges([]);
            showToast("Great session!", "success");
          }}
        />
      )}

      {/* Regular toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "2rem", right: "2rem",
          background: "var(--surface)",
          border: `1px solid ${toast.type === "success" ? "#43e97b" : toast.type === "error" ? "#ff6584" : "var(--cyan, #00d4ff)"}`,
          borderRadius: "12px",
          padding: "0.9rem 1.4rem",
          fontSize: "0.88rem", fontWeight: 600,
          color: toast.type === "success" ? "#43e97b" : toast.type === "error" ? "#ff6584" : "var(--cyan, #00d4ff)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          zIndex: 999,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}