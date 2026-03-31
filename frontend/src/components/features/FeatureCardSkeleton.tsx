export function FeatureCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="h-8 w-8 rounded bg-gray-200" />
          <div className="h-4 w-6 rounded bg-gray-200" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="flex gap-3">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
