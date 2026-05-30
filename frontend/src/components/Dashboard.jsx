import { useEffect, useState } from "react";
import MetricCard from "./MetricCard.jsx";
import DataTable from "./DataTable.jsx";
import SearchInsights from "./SearchInsights.jsx";
import PlaceholderPage from "./PlaceholderPage.jsx";
import PeriodFilter from "./PeriodFilter.jsx";
import TopActionsNow from "./TopActionsNow.jsx";
import ActionsPage from "./ActionsPage.jsx";
import IntegrationsPage from "./IntegrationsPage.jsx";
import PageHeader from "./PageHeader.jsx";
import HelpModal from "./HelpModal.jsx";
import "./Dashboard.css";

const VIEWS = {
  analytics: { id: "analytics", label: "Search Analytics", title: "Search Analytics" },
  actions: { id: "actions", label: "Actions", title: "Actions" },
  integrations: { id: "integrations", label: "Integrations", title: "Integrations" },
  "query-logs": { id: "query-logs", label: "Query Logs", title: "Query Logs" },
  indexes: { id: "indexes", label: "Indexes", title: "Indexes" },
};

const MAIN_NAV_ITEMS = [
  VIEWS.analytics,
  VIEWS.actions,
  VIEWS["query-logs"],
  VIEWS.indexes,
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function formatNumber(n) {
  return n.toLocaleString();
}

function NavButton({ item, activeView, onNavigate }) {
  return (
    <button
      type="button"
      className={`nav-item ${activeView === item.id ? "active" : ""}`}
      onClick={() => onNavigate(item.id)}
    >
      {item.label}
    </button>
  );
}

function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">⌕</span>
        <span className="logo-text">ProductHelp AI</span>
      </div>
      <div className="sidebar-body">
        <nav className="nav nav-main">
          {MAIN_NAV_ITEMS.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              activeView={activeView}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
        <nav className="nav nav-secondary">
          <NavButton
            item={VIEWS.integrations}
            activeView={activeView}
            onNavigate={onNavigate}
          />
        </nav>
      </div>
    </aside>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("analytics");
  const [period, setPeriod] = useState("7d");
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-state">
          <p>{error}</p>
          <p className="error-hint">Make sure the API server is running on port 3001.</p>
        </div>
      </div>
    );
  }

  const { metrics, topSearches, noResultsSearches, lowClickSearches } = data;
  const openHelp = () => setHelpOpen(true);
  const closeHelp = () => setHelpOpen(false);

  function renderMainContent() {
    if (activeView === "actions") {
      return <ActionsPage analytics={data} onHelpClick={openHelp} />;
    }

    if (activeView === "integrations") {
      return <IntegrationsPage onHelpClick={openHelp} />;
    }

    if (activeView === "analytics") {
      return (
        <>
          <PageHeader
            title="Search Analytics"
            subtitle="Search volume, result quality, and click engagement"
            actions={<PeriodFilter value={period} onChange={setPeriod} />}
            onHelpClick={openHelp}
          />

          <TopActionsNow analytics={data} />

          <section className="metrics-grid metrics-grid--four">
            <MetricCard
              label="Total Searches"
              value={formatNumber(metrics.totalSearches)}
              change={metrics.totalSearchesChange}
            />
            <MetricCard
              label="Unique Searches"
              value={formatNumber(metrics.uniqueSearches)}
              change={metrics.uniqueSearchesChange}
            />
            <MetricCard
              label="Failed Searches"
              value={formatNumber(metrics.failedSearches)}
              change={metrics.failedSearchesChange}
              invertChange
              hint="No results returned"
            />
            <MetricCard
              label="Low Engagement Searches"
              value={formatNumber(metrics.lowEngagementSearches)}
              change={metrics.lowEngagementSearchesChange}
              invertChange
              hint="No clicks on results"
            />
          </section>

          <div className="tables-grid">
            <DataTable
              title="Top Searches"
              subtitle="Highest volume search terms"
              columns={[
                { key: "term", label: "Search term" },
                {
                  key: "count",
                  label: "Count",
                  align: "right",
                  render: (r) => formatNumber(r.count),
                },
                {
                  key: "clickRate",
                  label: "Click rate",
                  align: "right",
                  render: (r) => `${r.clickRate}%`,
                },
              ]}
              rows={topSearches}
            />

            <DataTable
              title="Searches with No Results"
              subtitle="Terms that returned zero results"
              columns={[
                { key: "term", label: "Search term" },
                {
                  key: "count",
                  label: "Count",
                  align: "right",
                  render: (r) => formatNumber(r.count),
                },
              ]}
              rows={noResultsSearches}
            />

            <DataTable
              title="Searches with Low Clicks"
              subtitle="High volume terms with poor click engagement"
              columns={[
                { key: "term", label: "Search term" },
                {
                  key: "count",
                  label: "Count",
                  align: "right",
                  render: (r) => formatNumber(r.count),
                },
                {
                  key: "clickRate",
                  label: "Click rate",
                  align: "right",
                  render: (r) => `${r.clickRate}%`,
                },
              ]}
              rows={lowClickSearches}
            />
          </div>

          <SearchInsights analytics={data} />
        </>
      );
    }

    return (
      <>
        <PageHeader
          title={VIEWS[activeView].title}
          onHelpClick={openHelp}
        />
        <PlaceholderPage />
      </>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      <main className="main">
        {renderMainContent()}
      </main>

      <HelpModal open={helpOpen} onClose={closeHelp} />
    </div>
  );
}
