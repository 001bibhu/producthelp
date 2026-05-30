export default function MetricCard({ label, value, suffix, change, invertChange, hint }) {
  const isPositive = change >= 0;
  const isGood = invertChange ? !isPositive : isPositive;

  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      {hint && <span className="metric-hint">{hint}</span>}
      <div className="metric-value-row">
        <span className="metric-value">
          {value}
          {suffix && <span className="metric-suffix">{suffix}</span>}
        </span>
      </div>
      <span className={`metric-change ${isGood ? "positive" : "negative"}`}>
        {isPositive ? "↑" : "↓"} {Math.abs(change)}% vs last period
      </span>
    </div>
  );
}
