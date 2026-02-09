import ActivityFeed from "@/components/ActivityFeed";
import MetricsOverview from "@/components/MetricsOverview";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <MetricsOverview />
      <ActivityFeed />
    </div>
  );
}
