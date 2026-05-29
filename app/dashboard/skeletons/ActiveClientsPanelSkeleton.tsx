export default function ActiveClientsPanelSkeleton() {
  return (
    <div className="card hover:translate-y-0" aria-busy="true" aria-label="Loading active clients">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-64 animate-pulse rounded bg-white/5" />
        </div>
        <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
      </div>
      <div className="divide-y divide-white/10">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="h-4 w-44 animate-pulse rounded bg-white/10" />
            <div className="space-y-1 text-right">
              <div className="ml-auto h-3 w-24 animate-pulse rounded bg-white/5" />
              <div className="ml-auto h-4 w-8 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
