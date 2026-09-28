"use client"

import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { MonthPoint } from "@/lib/admin/stats"
import { money0 } from "@/lib/format"

/* One hue, two ordinal steps: billed is the filled context area, collected is
   the line that actually matters. */
const config = {
  billed: { label: "Billed", color: "var(--chart-1)" },
  collected: { label: "Collected", color: "var(--chart-3)" },
} satisfies ChartConfig

// Recharts 3 puts tick text where shadcn's CSS selector no longer reaches, so colour it here.
const TICK = { fill: "var(--muted-foreground)" }

export function BilledCollectedChart({ points }: { points: MonthPoint[] }) {
  if (points.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No jobs logged yet.</p>
  }

  return (
    <ChartContainer
      config={config}
      className="aspect-auto h-60 w-full"
      role="img"
      aria-label="Billed and collected by month"
    >
      <ComposedChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={TICK} />
        <YAxis tickLine={false} axisLine={false} width={64} tickCount={4} tick={TICK} tickFormatter={(v: number) => money0(v)} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => (
                <div className="flex w-full items-center gap-2">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-[2px]" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{config[name as keyof typeof config]?.label ?? name}</span>
                  <span className="ml-auto font-medium text-foreground tabular-nums">{money0(Number(value))}</span>
                </div>
              )}
            />
          }
        />
        <ChartLegend verticalAlign="top" content={<ChartLegendContent className="justify-start pb-4" />} />
        <Area
          dataKey="billed"
          type="linear"
          fill="var(--color-billed)"
          fillOpacity={0.55}
          stroke="var(--color-billed)"
          strokeWidth={2}
        />
        <Line dataKey="collected" type="linear" stroke="var(--color-collected)" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ChartContainer>
  )
}
