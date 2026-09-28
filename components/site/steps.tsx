import { cn } from "@/lib/utils"

type Step = { title: string; body: string }

/* Numbered steps in a hairline grid. "ink" sits on the dark bands (4 across),
   "plain" is the lighter three-step row on the free-trial page. */
export function Steps({ items, tone = "ink" }: { items: Step[]; tone?: "ink" | "plain" }) {
  const ink = tone === "ink"

  return (
    <ol
      className={cn(
        "reveal grid gap-px border",
        ink
          ? "border-panel-border bg-panel-border min-[561px]:grid-cols-2 min-[921px]:grid-cols-4"
          : "bg-border min-[761px]:grid-cols-3",
      )}
    >
      {items.map((step, i) => (
        <li
          key={step.title}
          className={cn(
            "flex flex-col gap-3",
            ink ? "bg-panel p-[clamp(24px,3vw,34px)]" : "bg-background p-[clamp(22px,3vw,32px)]",
          )}
        >
          <span className={cn("font-serif leading-none text-clay", ink ? "text-[2.1rem]" : "text-[1.7rem]")}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={ink ? "subheading" : "text-base font-semibold"}>{step.title}</h3>
          <p className={cn("text-[0.9rem]", ink ? "text-panel-muted" : "text-foreground/70")}>{step.body}</p>
        </li>
      ))}
    </ol>
  )
}
