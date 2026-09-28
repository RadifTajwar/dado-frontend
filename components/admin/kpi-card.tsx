/* Stat tiles: a small uppercase label, a big serif number, one line of context. */

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-[repeat(auto-fit,minmax(165px,1fr))] gap-4">{children}</div>
}

export function KpiCard({
  label,
  value,
  meta,
  spark,
}: {
  label: string
  value: React.ReactNode
  meta?: React.ReactNode
  spark?: number[]
}) {
  return (
    <div className="grid content-start gap-1.5 rounded-lg border bg-card px-4.5 py-4">
      <p className="text-[0.73rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">{label}</p>
      <p className="font-serif text-[1.85rem] leading-[1.05] tracking-[-0.01em] tabular-nums">{value}</p>
      {meta && <div className="flex flex-wrap items-center gap-2 text-[0.78rem] text-muted-foreground">{meta}</div>}
      {spark && spark.length > 1 && <Sparkline values={spark} />}
    </div>
  )
}

/* Tiny trend line under a KPI. Decorative: the number above is the data. */
function Sparkline({ values }: { values: number[] }) {
  const W = 120
  const H = 26
  const hi = Math.max(...values, 1)
  const lo = Math.min(...values, 0)
  const x = (i: number) => (i / (values.length - 1)) * W
  const y = (v: number) => H - 2 - ((v - lo) / Math.max(1, hi - lo)) * (H - 4)
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden className="mt-0.5 h-6.5 w-full text-clay">
      <polygon points={`0,${H} ${points} ${W},${H}`} fill="currentColor" fillOpacity={0.13} />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
