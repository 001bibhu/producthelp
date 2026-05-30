const MIN_COUNT = 5;
const MAX_CARDS_PER_SECTION = 5;
const LOW_CLICK_THRESHOLD = 30;

function sortByCountDesc(items) {
  return [...items].sort((a, b) => b.count - a.count);
}

function limit(items) {
  return items.slice(0, MAX_CARDS_PER_SECTION);
}

export function getMissingContent(data) {
  const items = [];

  for (const row of data.noResultsSearches ?? []) {
    const results = row.results ?? 0;
    if (row.count >= MIN_COUNT && results === 0) {
      items.push({
        id: `missing-${row.term}`,
        term: row.term,
        count: row.count,
        message: `${row.count.toLocaleString()} searches · no results returned`,
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
      items.push({
        id: `low-engage-${row.term}`,
        term: row.term,
        count: row.count,
        clickRate: row.clickRate,
        message: `${row.count.toLocaleString()} searches · ${row.clickRate}% click rate`,
      });
    }
  }

  return limit(sortByCountDesc(items));
}
