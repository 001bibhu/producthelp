export default function PageHeader({ title, subtitle, actions, onHelpClick }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="page-header-actions">
        {actions}
        <button
          type="button"
          className="help-btn"
          onClick={onHelpClick}
          aria-label="Help and FAQs"
          title="Help & FAQs"
        >
          ❓
        </button>
      </div>
    </header>
  );
}
