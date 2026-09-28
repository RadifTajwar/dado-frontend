import { cn } from "@/lib/utils"

/* The admin's standard panel: optional header (title, subtitle, actions) and a body. */
export function AdminCard({
  title,
  sub,
  action,
  flush = false,
  className,
  children,
}: {
  title?: React.ReactNode
  sub?: React.ReactNode
  action?: React.ReactNode
  flush?: boolean // body without padding (tables, lists)
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("min-w-0 overflow-hidden rounded-lg border bg-card", className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-center gap-3 border-b px-4.5 py-4">
          <div className="min-w-0">
            <h2 className="text-[0.92rem] font-semibold">{title}</h2>
            {sub && <p className="text-[0.78rem] text-muted-foreground">{sub}</p>}
          </div>
          {action && <div className="ml-auto flex items-center gap-1.5">{action}</div>}
        </header>
      )}
      <div className={flush ? undefined : "p-4.5"}>{children}</div>
    </section>
  )
}
