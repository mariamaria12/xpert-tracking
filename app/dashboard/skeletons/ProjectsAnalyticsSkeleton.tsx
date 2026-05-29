export default function ProjectsAnalyticsSkeleton() {
  return (
    <section className="mt-10" aria-busy="true" aria-label="Loading projects analytics">
      <div className="mb-6 h-7 w-56 animate-pulse rounded-lg bg-white/10" />
      <div className="mb-3 h-4 w-80 max-w-full animate-pulse rounded bg-white/5" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="card hover:translate-y-0">
            <div className="mb-5 h-5 w-40 animate-pulse rounded bg-white/10" />
            <div className="h-[240px] animate-pulse rounded-xl bg-white/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
