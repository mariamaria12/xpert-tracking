export default function ActiveProjectsPanelSkeleton() {
  return (
    <div className="card hover:translate-y-0" aria-busy="true" aria-label="Loading active projects">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-5 w-36 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-56 animate-pulse rounded bg-white/5" />
        </div>
        <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
      </div>
      <div className="divide-y divide-white/10">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-28 animate-pulse rounded bg-white/5" />
            </div>
            <div className="flex gap-6">
              <div className="h-8 w-20 animate-pulse rounded-full bg-white/5" />
              <div className="h-10 w-16 animate-pulse rounded bg-white/5" />
              <div className="h-10 w-20 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
