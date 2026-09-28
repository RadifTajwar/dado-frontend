"use client"

import { useState } from "react"

import { Switch } from "@/components/ui/switch"

/* A switch that flips at once and flips back if the save fails.
   Give it key={row.updatedAt} so every fresh copy of the row from the server resets it. */
export function ToggleSwitch({
  checked,
  onChange,
  label,
  onText,
  offText,
}: {
  checked: boolean
  onChange: (value: boolean) => Promise<boolean>
  label: string // accessible name, e.g. "Show Colour grade on the site"
  onText?: string
  offText?: string
}) {
  const [value, setValue] = useState(checked)

  async function toggle(next: boolean) {
    setValue(next)
    if (!(await onChange(next))) setValue(!next)
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Switch checked={value} onCheckedChange={toggle} aria-label={label} />
      {(onText || offText) && (
        <span className="text-[0.8rem] text-muted-foreground">{value ? onText : offText}</span>
      )}
    </span>
  )
}
