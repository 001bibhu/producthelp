import { getTopActions } from "../utils/searchInsights.js";

export default function TopActionsNow({ analytics }) {
  const actions = getTopActions(analytics);

  return (
    <section className="top-actions">
      <h2 className="top-actions-title">Top Actions to Take Now</h2>

      {actions.length === 0 ? (
        <p className="top-actions-empty">No urgent actions right now. Keep monitoring search trends.</p>
      ) : (
        <ul className="top-actions-list">
          {actions.map((item) => (
            <li key={item.id} className="top-actions-item">
              <span
                className={`priority-badge priority-badge--${item.priorityLevel}`}
              >
                {item.priorityLabel}
              </span>
              <span className={`top-actions-type top-actions-type--${item.actionVariant}`}>
                {item.actionType}
              </span>
              <span className="top-actions-term">{item.term}</span>
              <span className="top-actions-reason">{item.reason}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
