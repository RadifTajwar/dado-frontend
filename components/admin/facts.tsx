import { cn } from "@/lib/utils"

/* Small uppercase caption above a block inside dialogs and cards. */
export function MiniLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn("mb-2 text-[0.73rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase", className)}>
      {children}
    </p>
  )
}

export type Fact = { label: string; value: React.ReactNode; tone?: "ok" | "bad" }

/* A row of labelled figures separated by hairlines ("Jobs 4 · Charged $1,230 …"). */
export function Facts({ items, small = false }: { items: Fact[]; small?: boolean }) {
  return (
    // flex-wrap + grow: items in a short last row stretch to fill it, so no empty cell shows the grey hairline colour
    <dl className="flex flex-wrap gap-px overflow-hidden rounded-md border bg-border">
      {items.map((f) => (
        <div key={f.label} className="grow basis-[130px] bg-card px-4 py-3">
          <dt className="mb-1.5 text-[0.69rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            {f.label}
          </dt>
          <dd
            className={cn(
              small ? "text-[0.95rem] leading-snug" : "font-serif text-[1.32rem] leading-none tabular-nums",
              f.tone === "ok" && "text-ok",
              f.tone === "bad" && "text-bad",
            )}
          >
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/* A highlighted strip for warnings inside dialogs (e.g. "Flagged: email bounces"). */
export function Notice({ tone = "bad", children }: { tone?: "bad" | "clay"; children: React.ReactNode }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-2.5 rounded-md border-l-2 px-3.5 py-3 text-[0.85rem]",
        tone === "bad" ? "border-bad bg-bad-soft" : "border-clay bg-clay-soft",
      )}
    >
      <span aria-hidden>{tone === "bad" ? "⚑" : "ℹ"}</span>
      <div>{children}</div>
    </div>
  )
}
