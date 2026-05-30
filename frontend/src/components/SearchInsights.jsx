import { getMissingContent, getLowEngagementSearches } from "../utils/searchInsights.js";
import InsightCardSection from "./InsightCardSection.jsx";

export default function SearchInsights({ analytics }) {
  const missingContent = getMissingContent(analytics);
  const lowEngagement = getLowEngagementSearches(analytics);

  return (
    <div className="insights-stack">
      <InsightCardSection
        title="Missing Content"
        subtitle="Users searched but no content exists"
        items={missingContent}
        variant="gap"
      />
      <InsightCardSection
        title="Low Engagement Searches"
        subtitle="Users searched but didn't find helpful results"
        items={lowEngagement}
        variant="engage"
      />
    </div>
  );
}
