function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`}
    />
  )
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
      <Shimmer className="h-7 w-16" />
      <Shimmer className="h-3 w-12" />
    </div>
  )
}

function ChapterSkeleton({ wide }: { wide?: boolean }) {
  return (
    <div className="relative ml-8 md:ml-16">
      {/* Timeline node */}
      <div className="absolute -left-[2.75rem] md:-left-[3.75rem] top-6 h-4 w-4 rounded-full border-2 border-white/10 bg-[#050508]" />

      <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d1a] p-6 md:p-8">
        {/* Chapter label + date */}
        <div className="mb-4 flex items-center gap-3">
          <Shimmer className="h-5 w-20 rounded-full" />
          <Shimmer className="h-4 w-32" />
        </div>

        {/* Chapter title */}
        <Shimmer className={`mb-3 h-7 ${wide ? 'w-72' : 'w-56'}`} />

        {/* Description lines */}
        <Shimmer className="mb-2 h-4 w-full" />
        <Shimmer className="mb-6 h-4 w-4/5" />

        {/* Commit count pill */}
        <div className="mb-6 flex gap-2">
          <Shimmer className="h-7 w-28 rounded-full" />
        </div>

        {/* Contributor avatars */}
        <div className="mb-6 flex items-center gap-2">
          <Shimmer className="h-3 w-8" />
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 animate-pulse rounded-full border-2 border-[#0d0d1a] bg-white/[0.08]"
              />
            ))}
          </div>
        </div>

        {/* Language donut placeholder */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <Shimmer className="mb-3 h-3 w-20" />
          <div className="flex items-center gap-6">
            <div className="h-[120px] w-[120px] animate-pulse rounded-full border-[14px] border-white/[0.06] bg-transparent" />
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-white/10" />
                  <Shimmer className={`h-3 ${i % 2 === 0 ? 'w-20' : 'w-16'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TimelineLoading() {
  return (
    <div className="min-h-screen bg-[#050508]" role="status" aria-busy="true" aria-label="Loading timeline">
      {/* Header skeleton */}
      <div className="border-b border-white/[0.06] px-6 pb-12 pt-10">
        <div className="mx-auto max-w-4xl">
          {/* Nav row */}
          <div className="mb-10 flex items-center justify-between">
            <Shimmer className="h-5 w-12" />
            <div className="flex gap-3">
              <Shimmer className="h-9 w-20 rounded-full" />
              <Shimmer className="h-9 w-24 rounded-full" />
            </div>
          </div>

          {/* Repo identity */}
          <div className="mb-8 flex items-start gap-4">
            <Shimmer className="h-14 w-14 shrink-0 rounded-2xl" />
            <div className="flex flex-col gap-2">
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-9 w-48" />
              <Shimmer className="h-4 w-72" />
            </div>
          </div>

          {/* Stat cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>

          {/* Sparkline */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <Shimmer className="mb-3 h-3 w-28" />
            <Shimmer className="h-14 w-full" />
          </div>
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 flex flex-col items-center gap-2">
          <Shimmer className="h-7 w-48" />
          <Shimmer className="h-4 w-36" />
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 h-full w-0.5 bg-white/[0.04] md:left-5" />

          <div className="flex flex-col gap-12">
            <ChapterSkeleton />
            <ChapterSkeleton wide />
            <ChapterSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
