import PageHeader from "./PageHeader.jsx";

const SCRIPT_SNIPPET = `<script src="https://yourdomain.com/producthelp.js"></script>`;

const TRACK_SNIPPET = `window.productHelp.track(query);`;

const SEARCH_EXAMPLE = `onSearch(query) {
  window.productHelp.track(query);
}`;

export default function IntegrationsPage({ onHelpClick }) {
  return (
    <>
      <PageHeader
        title="Install ProductHelp AI"
        subtitle="Add search tracking to your documentation site in minutes"
        onHelpClick={onHelpClick}
      />

      <div className="integrations-content">
        <section className="integration-step">
          <h2 className="integration-step-title">Step 1</h2>
          <p className="integration-step-desc">
            Add the script to your docs site:
          </p>
          <pre className="code-block">
            <code>{SCRIPT_SNIPPET}</code>
          </pre>
        </section>

        <section className="integration-step">
          <h2 className="integration-step-title">Step 2</h2>
          <p className="integration-step-desc">
            Call the tracking function when a user searches:
          </p>
          <pre className="code-block">
            <code>{TRACK_SNIPPET}</code>
          </pre>
        </section>

        <section className="integration-step">
          <h2 className="integration-step-title">Step 3</h2>
          <p className="integration-step-desc">
            Refresh the dashboard to see insights.
          </p>
        </section>

        <section className="integration-step">
          <h2 className="integration-step-title">Example: generic search input</h2>
          <p className="integration-step-desc">
            Hook tracking into your existing search handler:
          </p>
          <pre className="code-block">
            <code>{SEARCH_EXAMPLE}</code>
          </pre>
        </section>
      </div>
    </>
  );
}
