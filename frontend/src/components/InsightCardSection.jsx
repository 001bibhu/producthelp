export default function InsightCardSection({ title, subtitle, items, variant }) {
  return (
    <section className="insight-section">
      <header className="insight-header">
        <h2 className="insight-title">{title}</h2>
        <p className="insight-subtitle">{subtitle}</p>
      </header>

      {items.length === 0 ? (
        <p className="insight-empty">No matching searches in this period.</p>
      ) : (
        <div className="insight-grid">
          {items.map((item) => (
            <article key={item.id} className={`action-card action-card--${variant}`}>
              <div className="action-card-top">
                <h3 className="action-card-title">{item.cardTitle}</h3>
                <span
                  className={`priority-badge priority-badge--${item.priorityLevel}`}
                >
                  {item.priorityLabel}
                </span>
              </div>
              <p className="action-card-term">{item.term}</p>
              <p className="action-card-message">{item.explanation}</p>
              <p className="action-card-action">{item.suggestedAction}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
