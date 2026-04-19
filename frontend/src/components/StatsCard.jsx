export default function StatsCard({ icon, label, value, highlight }) {
  return (
    <div className={`stats-card ${highlight ? "highlight" : ""}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-value">{value}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}