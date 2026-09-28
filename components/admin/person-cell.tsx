import { hostOf, initials, isSafeUrl } from "@/lib/format"
import { cn } from "@/lib/utils"

/* Round initials badge used for clients, requesters and senders. */
export function Initials({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full bg-clay-soft text-[0.76rem] font-bold text-clay",
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}

/* "NB  Halden & Co / Nora Beckett · nora@…" — the first cell of most admin tables.
   min-w-55 (220px) stops auto table layout from squeezing it to a sliver;
   the table scrolls sideways inside its card instead. */
export function PersonCell({
  name,
  title,
  sub,
  unread = false,
}: {
  name: string
  title: string
  sub?: string
  unread?: boolean
}) {
  return (
    <div className="flex min-w-55 items-center gap-2.5">
      {unread && (
        <span className="size-1.75 shrink-0 rounded-full bg-clay">
          <span className="sr-only">Unread</span>
        </span>
      )}
      <Initials name={name} />
      <div className="grid min-w-0 gap-px">
        <b title={title} className={cn("truncate", unread ? "font-bold" : "font-semibold")}>
          {title}
        </b>
        {sub && (
          <span title={sub} className="truncate text-[0.78rem] text-muted-foreground">
            {sub}
          </span>
        )}
      </div>
    </div>
  )
}

/* Outbound link to a client's files. Anything that isn't http(s) is shown as text, never linked. */
export function FileLink({ url, className }: { url: string; className?: string }) {
  if (!url) return <span className="text-muted-foreground">—</span>
  if (!isSafeUrl(url)) return <span className={cn("break-all text-muted-foreground", className)}>{url}</span>
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={url}
      className={cn("font-medium underline decoration-border underline-offset-3 hover:decoration-clay", className)}
    >
      {hostOf(url) || "Open link"} ↗
    </a>
  )
}
