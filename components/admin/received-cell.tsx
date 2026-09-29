import { dateWithToday, formatTime } from "@/lib/format"
import { cn } from "@/lib/utils"

/* When something happened: "29.09.2026 (Today)" with the time under it
   ("1:48 PM"), in the studio's time zone. Plain "YYYY-MM-DD" days (like job
   dates) have no time, so they show the date only. */
export function ReceivedCell({ at, className }: { at: string; className?: string }) {
  return (
    <span className={cn("grid leading-snug whitespace-nowrap", className)}>
      <span>{dateWithToday(at)}</span>
      {at.length > 10 && <span className="text-[0.78rem] text-muted-foreground tabular-nums">{formatTime(at)}</span>}
    </span>
  )
}
