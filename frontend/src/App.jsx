import { useState, useEffect } from "react";
import AuthPage          from "./pages/AuthPage";
import Dashboard         from "./pages/Dashboard";
import AdminDashboard    from "./pages/AdminDashboard";
import PublicProfilePage from "./pages/PublicProfilePage";

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button className="theme-toggle" onClick={onToggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <span>{isDark ? "Dark" : "Light"}</span>
      <div className={`theme-toggle-switch${isDark ? " on" : ""}`}>
        <div className="theme-toggle-knob" />
      </div>
    </button>
  );
}

function applyTheme(t) {
  const root = document.documentElement;
  if (t === "dark") { root.classList.add("dark"); root.classList.remove("light"); }
  else              { root.classList.remove("dark"); root.classList.add("light"); }
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [user,  setUser]  = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("cst_theme") || "light";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("cst_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.role) parsed.role = "USER";
        setUser(parsed);
      } catch { localStorage.removeItem("cst_user"); }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("cst_theme", next);
    applyTheme(next);
  };

  const handleLogin = (userData) => {
    const toStore = {
      token:    userData.token,
      id:       userData.id,
      username: userData.username,
      role:     userData.role || "USER",
    };
    localStorage.setItem("cst_user", JSON.stringify(toStore));
    setUser(toStore);
  };

  const handleLogout = () => {
    localStorage.removeItem("cst_user");
    setUser(null);
  };

  const path = window.location.pathname;
  if (path.startsWith("/profile/")) {
    const username = path.replace("/profile/", "").split("/")[0];
    return (
      <>
        <PublicProfilePage username={username} />
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </>
    );
  }

  let page;
  if (!user) {
    page = <AuthPage onLogin={handleLogin} />;
  } else if (user.role === "ADMIN") {
    page = <AdminDashboard user={user} onLogout={handleLogout} />;
  } else {
    page = <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <>
      {page}
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
    </>
  );
}