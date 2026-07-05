import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-8 py-6 md:gap-8 md:py-8 animate-pulse">
          
          {/* ── User Profile Header Skeleton ── */}
          <div className="px-4 lg:px-6 flex items-center justify-between gap-6 pb-6 border-b border-zinc-900">
            <div className="flex items-center gap-5">
              <div className="size-16 rounded-xl bg-zinc-900 shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-48 bg-zinc-900 rounded" />
                  <div className="h-4 w-16 bg-zinc-900/60 rounded" />
                </div>
                <div className="h-4 w-96 bg-zinc-900/40 rounded" />
                <div className="flex items-center gap-3 pt-1">
                  <div className="h-3 w-16 bg-zinc-900/30 rounded" />
                  <div className="h-3 w-20 bg-zinc-900/30 rounded" />
                  <div className="h-3 w-20 bg-zinc-900/30 rounded" />
                </div>
              </div>
            </div>
            <div className="h-9 w-32 bg-zinc-900 rounded-lg shrink-0 hidden md:block" />
          </div>

          {/* ── Developer Insights Cards Skeleton (3 Columns) ── */}
          <div className="grid grid-cols-1 gap-5 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border border-zinc-900 bg-zinc-950/20 p-6 h-36 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-zinc-900 rounded" />
                    <div className="h-6 w-32 bg-zinc-900 rounded" />
                  </div>
                  <div className="size-8 bg-zinc-900 rounded-lg shrink-0" />
                </div>
                <div className="h-3 w-full bg-zinc-900/40 rounded mt-4" />
              </Card>
            ))}
          </div>

          {/* ── Grid 2-Column Skeletons (PRs + Issues) ── */}
          <div className="grid gap-6 px-4 lg:px-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="border border-zinc-900 bg-zinc-950/20 h-[380px] flex flex-col justify-between">
                <div className="px-6 py-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/30">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-zinc-900 rounded" />
                    <div className="h-3 w-48 bg-zinc-900/60 rounded" />
                  </div>
                  <div className="h-5 w-16 bg-zinc-900/40 rounded" />
                </div>
                <div className="flex-1 p-6 space-y-5">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex gap-3 items-center">
                      <div className="size-4 rounded bg-zinc-900 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-zinc-900/50 rounded" />
                        <div className="h-2 w-32 bg-zinc-900/20 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-zinc-900 bg-zinc-950/40 text-center">
                  <div className="h-4 w-40 bg-zinc-900/30 rounded mx-auto" />
                </div>
              </Card>
            ))}
          </div>

          {/* ── Chart + Timeline Skeleton ── */}
          <div className="grid gap-6 px-4 lg:px-6 md:grid-cols-3">
            {/* Chart (2/3 width) */}
            <Card className="border border-zinc-900 bg-zinc-950/20 p-6 md:col-span-2 h-[320px] flex flex-col justify-between">
              <div className="space-y-2 pb-4 border-b border-zinc-900">
                <div className="h-4 w-40 bg-zinc-900 rounded" />
                <div className="h-3 w-64 bg-zinc-900/60 rounded" />
              </div>
              <div className="flex-1 flex flex-col justify-end gap-6 pt-6">
                <div className="h-3 w-full bg-zinc-900/60 rounded-full" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, idx) => (
                    <div key={idx} className="h-14 p-3 rounded-lg border border-zinc-900 bg-zinc-950/40 space-y-2">
                      <div className="h-3.5 w-16 bg-zinc-900 rounded" />
                      <div className="h-3.5 w-12 bg-zinc-900/40 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Timeline (1/3 width) */}
            <Card className="border border-zinc-900 bg-zinc-950/20 md:col-span-1 h-[320px] flex flex-col justify-between">
              <div className="px-6 py-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/30">
                <div className="h-4 w-28 bg-zinc-900 rounded" />
                <div className="h-3.5 w-8 bg-zinc-900/40 rounded" />
              </div>
              <div className="flex-1 p-6 space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="size-7 rounded-lg bg-zinc-900 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-full bg-zinc-900/50 rounded" />
                      <div className="h-2 w-20 bg-zinc-900/20 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
