"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import type { BarRow } from "@/lib/admin/stats"
import { money0 } from "@/lib/format"

/* Nominal categories get one hue only (clay) — no rainbow. */
const config = { value: { label: "Revenue", color: "var(--clay)" } } satisfies ChartConfig

const BAR = 26
const GAP = 12
const AXIS = 170 // room for the category names
const MAX_CHARS = 24 // what fits in AXIS at 12px on one line

/* One-line category name, cut with "…" when too long; the full name is in the
   SVG <title> (shown on hover and read by screen readers). */
function CategoryTick({ x, y, payload }: { x?: number | string; y?: number | string; payload?: { value?: unknown } }) {
  const full = String(payload?.value ?? "")
  const text = full.length > MAX_CHARS ? `${full.slice(0, MAX_CHARS - 1)}…` : full
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={12} fill="var(--muted-foreground)">
      <title>{full}</title>
      {text}
    </text>
  )
}

/* Horizontal revenue bars with the value written at the end of each bar. */
export function MoneyBars({ rows, label }: { rows: BarRow[]; label: string }) {
  if (rows.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No data yet.</p>
  }

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: rows.length * (BAR + GAP) + GAP }}
      role="img"
      aria-label={label}
    >
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 72, bottom: 0, left: 0 }} barSize={BAR}>
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis
          type="category"
          dataKey="label"
          width={AXIS}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={(props) => <CategoryTick {...props} />}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          content={({ active, payload }) => {
            const row = payload?.[0]?.payload as BarRow | undefined
            if (!active || !row) return null
            return (
              <div className="grid gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                <b className="font-medium">{row.label}</b>
                <span className="flex items-center gap-2 tabular-nums">
                  <span aria-hidden className="size-2.5 rounded-[2px] bg-clay" />
                  {money0(row.value)}
                  {row.meta && <span className="text-muted-foreground">· {row.meta}</span>}
                </span>
              </div>
            )
          }}
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]}>
          <LabelList
            dataKey="value"
            position="right"
            offset={10}
            fill="var(--muted-foreground)"
            fontSize={12}
            formatter={(v) => money0(Number(v))}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
