import { useFeatures } from "../../hooks/useFeatures";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";
import { Pagination } from "../ui/Pagination";
import { FeatureCard } from "./FeatureCard";
import { FeatureCardSkeleton } from "./FeatureCardSkeleton";
import { VoteButton } from "./VoteButton";

export function FeatureList() {
  const { data, isLoading, isError, error, refetch } = useFeatures();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <FeatureCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Failed to load features."
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.results.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="space-y-3">
        {data.results.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            voteButton={<VoteButton feature={feature} />}
          />
        ))}
      </div>
      <Pagination count={data.count} />
    </div>
  );
}
