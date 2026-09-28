"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type SegmentOption<V extends string> = { value: V; label: string; count?: number }

/* A labelled row of joined toggle buttons used as a single-choice filter. */
export function Segmented<V extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: V
  onChange: (value: V) => void
  options: SegmentOption<V>[]
}) {
  return (
    <div className="flex max-w-full flex-wrap items-center gap-2">
      <span className="shrink-0 text-[0.7rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">{label}</span>
      <div className="min-w-0 max-w-full">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={0}
          value={value}
          // Radix clears the value when the active item is clicked again; ignore that.
          onValueChange={(v) => v && onChange(v as V)}
          aria-label={`Filter by ${label.toLowerCase()}`}
          className="flex-wrap bg-card"
        >
          {options.map((o) => (
            <ToggleGroupItem
              key={o.value}
              value={o.value}
              className="gap-1.5 px-3 text-[0.82rem] font-normal text-muted-foreground data-[state=on]:bg-clay data-[state=on]:font-semibold data-[state=on]:text-clay-foreground"
            >
              {o.label}
              {o.count !== undefined && <span className="tabular-nums opacity-80">{o.count}</span>}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}
