import { cn } from "@/lib/utils"

const VARIANTS = {
  pill: "rounded-full border border-input px-[13px] py-[7px] text-[0.79rem] text-foreground/70",
  tag: "rounded-[2px] border px-[11px] py-1.5 text-[0.78rem] text-muted-foreground",
} as const

/* A wrapping row of small labels: service facts (pill) or accepted file hosts (tag). */
export function Chips({
  items,
  variant = "pill",
  className,
}: {
  items: readonly string[]
  variant?: keyof typeof VARIANTS
  className?: string
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li key={item} className={VARIANTS[variant]}>
          {item}
        </li>
      ))}
    </ul>
  )
}
