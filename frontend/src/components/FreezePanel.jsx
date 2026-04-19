import { useState } from "react";
import { API, authHeaders } from "../api";

export default function FreezePanel({ userId, token, freezeCount, currentStreak, nextFreezeIn, onFreezeUsed }) {
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState("");
  const [msgType, setMsgType] = useState("success");

  const useFreeze = async () => {
    if (freezeCount <= 0) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API}/stats/${userId}/use-freeze`, {
        method: "POST", headers: authHeaders(token),
      });
      const data = await res.json();
      setMsg(data.message);
      setMsgType(data.success ? "success" : "error");
      if (data.success) onFreezeUsed(data.freezeCount);
    } catch {
      setMsg("Failed to use freeze."); setMsgType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(0,212,255,0.05), var(--surface))",
      border: "1px solid rgba(0,212,255,0.2)",
      borderRadius: "14px",
      padding: "1.4rem 1.6rem",
      marginBottom: "1.5rem",
      display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap",
    }}>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <div style={{
          fontSize: "0.72rem", fontWeight: 800, color: "var(--cyan, #00d4ff)",
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem",
        }}>
          Streak Freeze Economy
        </div>
        <p style={{ fontSize: "0.86rem", color: "var(--muted)", lineHeight: 1.55 }}>
          Earn 1 freeze every 7-day streak milestone. Use a freeze on a missed day to protect your streak from resetting.
        </p>
        {nextFreezeIn !== undefined && nextFreezeIn < 7 && (
          <p style={{ fontSize: "0.8rem", color: "var(--cyan, #00d4ff)", marginTop: "0.4rem", fontWeight: 600 }}>
            Next freeze earned in {nextFreezeIn} day{nextFreezeIn !== 1 ? "s" : ""}.
          </p>
        )}
        {msg && (
          <p style={{
            fontSize: "0.82rem", marginTop: "0.4rem", fontWeight: 600,
            color: msgType === "success" ? "var(--accent3, #43e97b)" : "var(--accent2, #ff6584)",
          }}>
            {msg}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
        <div style={{
          fontSize: "2.8rem", fontWeight: 900,
          fontFamily: "JetBrains Mono, monospace",
          color: "var(--cyan, #00d4ff)", lineHeight: 1,
        }}>
          {freezeCount}
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          freezes
        </div>
        <button
          onClick={useFreeze}
          disabled={freezeCount <= 0 || loading}
          style={{
            marginTop: "0.25rem",
            background: freezeCount > 0 ? "rgba(0,212,255,0.1)" : "transparent",
            border: "1px solid rgba(0,212,255,0.3)",
            color: freezeCount > 0 ? "var(--cyan, #00d4ff)" : "var(--muted)",
            padding: "0.45rem 1rem", borderRadius: "10px",
            cursor: freezeCount > 0 ? "pointer" : "not-allowed",
            fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "0.85rem",
            opacity: freezeCount <= 0 ? 0.5 : 1, transition: "all 0.2s",
          }}
        >
          {loading ? "..." : "Use Freeze"}
        </button>
      </div>
    </div>
  );
}