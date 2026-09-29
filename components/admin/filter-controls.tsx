"use client"

import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { NO_RANGE, type DateRange } from "@/lib/admin/filters"

// Same small caps label as the Segmented filters, so a filter row reads as one set.
const LABEL = "shrink-0 text-[0.7rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase"

/* A labelled dropdown filter. Pass <NativeSelectOption>s (and optgroups) as children. */
export function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex items-center gap-2">
      <span className={LABEL}>{label}</span>
      <NativeSelect size="sm" value={value} onChange={(e) => onChange(e.target.value)} className="max-w-60 bg-card">
        {children}
      </NativeSelect>
    </label>
  )
}

/* From / to day pickers (the browser's own date input) with a clear button. */
export function DateRangeFilter({
  label,
  value,
  onChange,
}: {
  label: string
  value: DateRange
  onChange: (value: DateRange) => void
}) {
  const input = "h-8 w-auto bg-card text-[0.82rem]"
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={LABEL}>{label}</span>
      <Input
        type="date"
        aria-label={`${label} from`}
        value={value.from}
        max={value.to || undefined}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
        className={input}
      />
      <span aria-hidden className="text-muted-foreground">
        –
      </span>
      <Input
        type="date"
        aria-label={`${label} to`}
        value={value.to}
        min={value.from || undefined}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
        className={input}
      />
      {(value.from || value.to) && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Clear the ${label.toLowerCase()} dates`}
          onClick={() => onChange(NO_RANGE)}
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}
