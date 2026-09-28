import type { Tone } from "@/lib/admin/labels"
import { cn } from "@/lib/utils"

const TONES: Record<Tone, string> = {
  clay: "bg-clay-soft text-clay",
  ok: "bg-ok-soft text-ok",
  bad: "bg-bad-soft text-bad",
  outline: "border-input text-muted-foreground",
  muted: "bg-muted text-muted-foreground",
}

/* A small rounded label. With `dot`, it reads as a status; the text always
   carries the meaning, so colour is never the only signal. */
export function StatusBadge({
  tone = "outline",
  dot = false,
  className,
  children,
}: {
  tone?: Tone
  dot?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {dot && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  )
}
