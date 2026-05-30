import { useMemo, useState } from "react";
import DataTable from "./DataTable.jsx";
import { getAllActions } from "../utils/searchInsights.js";

const PRIORITY_FILTERS = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function formatNumber(n) {
  return n.toLocaleString();
}

export default function ActionsPage({ analytics }) {
  const [priorityFilter, setPriorityFilter] = useState("all");

  const allActions = useMemo(() => getAllActions(analytics), [analytics]);

  const filteredActions = useMemo(() => {
    if (priorityFilter === "all") {
      return allActions;
    }
    return allActions.filter((row) => row.priorityLevel === priorityFilter);
  }, [allActions, priorityFilter]);

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Actions</h1>
          <p className="page-subtitle">
            All content gaps and low-engagement searches that need attention
          </p>
        </div>
      </header>

      <div className="actions-toolbar">
        <span className="actions-toolbar-label">Priority</span>
        <div className="actions-filter-group" role="group" aria-label="Filter by priority">
          {PRIORITY_FILTERS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`actions-filter-btn ${
                priorityFilter === opt.value ? "actions-filter-btn--active" : ""
              }`}
              onClick={() => setPriorityFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="actions-count">
          {filteredActions.length} action{filteredActions.length === 1 ? "" : "s"}
        </span>
      </div>

      <DataTable
        title="Recommended actions"
        subtitle="Sorted by search count (highest first)"
        emptyMessage="No actions match this filter."
        columns={[
          {
            key: "priority",
            label: "Priority",
            render: (r) => (
              <span className={`priority-badge priority-badge--${r.priorityLevel}`}>
                {r.priorityLabel}
              </span>
            ),
          },
          {
            key: "actionType",
            label: "Action type",
            render: (r) => (
              <span className={`top-actions-type top-actions-type--${r.actionVariant}`}>
                {r.actionType}
              </span>
            ),
          },
          { key: "term", label: "Search term" },
          {
            key: "count",
            label: "Search count",
            align: "right",
            render: (r) => formatNumber(r.count),
          },
        ]}
        rows={filteredActions}
      />
    </>
  );
}
