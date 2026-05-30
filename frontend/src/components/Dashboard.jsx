import { useEffect, useState } from "react";
import MetricCard from "./MetricCard.jsx";
import DataTable from "./DataTable.jsx";
import SearchInsights from "./SearchInsights.jsx";
import PlaceholderPage from "./PlaceholderPage.jsx";
import PeriodFilter from "./PeriodFilter.jsx";
import TopActionsNow from "./TopActionsNow.jsx";
import ActionsPage from "./ActionsPage.jsx";
import "./Dashboard.css";

const VIEWS = {
  analytics: { id: "analytics", label: "Search Analytics", title: "Search Analytics" },
  actions: { id: "actions", label: "Actions", title: "Actions" },
  "query-logs": { id: "query-logs", label: "Query Logs", title: "Query Logs" },
  indexes: { id: "indexes", label: "Indexes", title: "Indexes" },
};

const NAV_ITEMS = [
  VIEWS.analytics,
  VIEWS.actions,
  VIEWS["query-logs"],
  VIEWS.indexes,
];

function formatNumber(n) {
  return n.toLocaleString();
}

function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">⌕</span>
        <span className="logo-text">ProductHelp AI</span>
      </div>
      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activeView === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("analytics");
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`)
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
  const isAnalytics = activeView === "analytics";
  const isActions = activeView === "actions";

  return (
    <div className="dashboard">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      <main className="main">
        {isActions ? (
          <ActionsPage analytics={data} />
        ) : isAnalytics ? (
          <>
            <header className="page-header">
              <div>
                <h1>Search Analytics</h1>
                <p className="page-subtitle">
                  Search volume, result quality, and click engagement
                </p>
              </div>
              <PeriodFilter value={period} onChange={setPeriod} />
            </header>

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
        ) : (
          <PlaceholderPage title={VIEWS[activeView].title} />
        )}
      </main>
    </div>
  );
}
