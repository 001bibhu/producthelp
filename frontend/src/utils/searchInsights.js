const MIN_COUNT = 5;
const MAX_CARDS_PER_SECTION = 5;
const MAX_TOP_ACTIONS = 3;
const LOW_CLICK_THRESHOLD = 30;

function sortByCountDesc(items) {
  return [...items].sort((a, b) => b.count - a.count);
}

function limit(items) {
  return items.slice(0, MAX_CARDS_PER_SECTION);
}

function getPriority(count) {
  if (count > 50) {
    return { level: "high", label: "High priority" };
  }
  if (count >= 20) {
    return { level: "medium", label: "Medium priority" };
  }
  return { level: "low", label: "Low priority" };
}

function getPriorityShortLabel(count) {
  const { level } = getPriority(count);
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function isShortTerm(term) {
  const words = term.trim().split(/\s+/).filter(Boolean);
  return words.length <= 2;
}

function normalizeTerm(term) {
  return term.trim().toLowerCase();
}

function getContextualSuggestedAction(term, fallback) {
  const lower = term.toLowerCase();

  if (lower.includes("login")) {
    return "Suggested action: Add troubleshooting steps for login issues such as password reset and account lock.";
  }
  if (lower.includes("pricing")) {
    return "Suggested action: Add clear pricing breakdown and comparison table for plans.";
  }
  if (lower.includes("policy") || lower.includes("terms")) {
    return "Suggested action: Simplify language and add a summary section for quick understanding.";
  }
  if (lower.includes("api") || lower.includes("integration")) {
    return "Suggested action: Add step-by-step examples and sample requests to improve usability.";
  }

  return `Suggested action: ${fallback}`;
}

function buildMissingExplanation(term, count) {
  const formattedCount = count.toLocaleString();

  if (isShortTerm(term)) {
    return `Users searching '${term}' may be looking for different things (e.g. related issues or tasks), but no matching content exists after ${formattedCount} searches.`;
  }

  return `Users searched '${term}' ${formattedCount} times but no content exists. This indicates a clear content gap.`;
}

function buildLowEngagementExplanation(term, count) {
  const formattedCount = count.toLocaleString();

  if (isShortTerm(term)) {
    return `Users searching '${term}' may be looking for different things (e.g. related issues or tasks), but are not finding relevant results across ${formattedCount} searches.`;
  }

  return `Users frequently search '${term}' but rarely click results (${formattedCount} searches). This suggests the content may be unclear or hard to find.`;
}

export function getMissingContent(data) {
  const items = [];

  for (const row of data.noResultsSearches ?? []) {
    const results = row.results ?? 0;
    if (row.count >= MIN_COUNT && results === 0) {
      const priority = getPriority(row.count);
      items.push({
        id: `missing-${row.term}`,
        term: row.term,
        count: row.count,
        cardTitle: "Create new content",
        priorityLevel: priority.level,
        priorityLabel: priority.label,
        explanation: buildMissingExplanation(row.term, row.count),
        suggestedAction: getContextualSuggestedAction(
          row.term,
          "Create a new article addressing this topic."
        ),
      });
    }
  }

  return limit(sortByCountDesc(items));
}

export function getLowEngagementSearches(data) {
  const items = [];
  const seen = new Set();
  const candidates = [
    ...(data.lowClickSearches ?? []),
    ...(data.topSearches ?? []).filter((r) => r.clickRate < LOW_CLICK_THRESHOLD),
  ];

  for (const row of candidates) {
    if (
      row.count >= MIN_COUNT &&
      row.clickRate < LOW_CLICK_THRESHOLD &&
      !seen.has(row.term)
    ) {
      seen.add(row.term);
      const priority = getPriority(row.count);
      items.push({
        id: `low-engage-${row.term}`,
        term: row.term,
        count: row.count,
        clickRate: row.clickRate,
        cardTitle: "Improve existing content",
        priorityLevel: priority.level,
        priorityLabel: priority.label,
        explanation: buildLowEngagementExplanation(row.term, row.count),
        suggestedAction: getContextualSuggestedAction(
          row.term,
          "Improve content clarity, update keywords, or adjust search ranking."
        ),
      });
    }
  }

  return limit(sortByCountDesc(items));
}

export function getTopActions(data) {
  const actions = [];
  const seen = new Set();

  const missingCandidates = sortByCountDesc(
    (data.noResultsSearches ?? []).filter(
      (row) => row.count >= MIN_COUNT && (row.results ?? 0) === 0
    )
  );

  for (const row of missingCandidates) {
    if (actions.length >= MAX_TOP_ACTIONS) {
      return actions;
    }

    const priority = getPriority(row.count);
    seen.add(normalizeTerm(row.term));
    actions.push({
      id: `top-missing-${row.term}`,
      actionType: "Create content",
      actionVariant: "create",
      term: row.term,
      count: row.count,
      reason: "High search demand but no content exists",
      priorityLevel: priority.level,
      priorityLabel: priority.label,
    });
  }

  const lowEngagementCandidates = sortByCountDesc(
    (data.lowClickSearches ?? []).filter(
      (row) => row.count >= MIN_COUNT && row.clickRate < LOW_CLICK_THRESHOLD
    )
  );

  for (const row of lowEngagementCandidates) {
    if (actions.length >= MAX_TOP_ACTIONS) {
      break;
    }

    if (seen.has(normalizeTerm(row.term))) {
      continue;
    }

    const priority = getPriority(row.count);
    actions.push({
      id: `top-engage-${row.term}`,
      actionType: "Improve content",
      actionVariant: "improve",
      term: row.term,
      count: row.count,
      reason: "Users search but don't engage with results",
      priorityLevel: priority.level,
      priorityLabel: priority.label,
    });
  }

  return actions;
}

export function getAllActions(data) {
  const actions = [];
  const seen = new Set();

  for (const row of data.noResultsSearches ?? []) {
    if (row.count >= MIN_COUNT && (row.results ?? 0) === 0) {
      const priority = getPriority(row.count);
      seen.add(normalizeTerm(row.term));
      actions.push({
        id: `action-missing-${row.term}`,
        term: row.term,
        count: row.count,
        actionType: "Create",
        actionVariant: "create",
        priorityLevel: priority.level,
        priorityLabel: getPriorityShortLabel(row.count),
      });
    }
  }

  for (const row of data.lowClickSearches ?? []) {
    if (row.count >= MIN_COUNT && row.clickRate < LOW_CLICK_THRESHOLD) {
      if (seen.has(normalizeTerm(row.term))) {
        continue;
      }

      const priority = getPriority(row.count);
      actions.push({
        id: `action-engage-${row.term}`,
        term: row.term,
        count: row.count,
        actionType: "Improve",
        actionVariant: "improve",
        priorityLevel: priority.level,
        priorityLabel: getPriorityShortLabel(row.count),
      });
    }
  }

  return sortByCountDesc(actions);
}
