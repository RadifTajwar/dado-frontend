import { BeforeAfter } from "@/components/site/before-after"
import type { PortfolioItem } from "@/lib/types"

/* Home "Recent work": the admin's before/after pairs, three to a row. */
export function BeforeAfterGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="grid gap-[clamp(16px,2vw,26px)] min-[921px]:grid-cols-3">
      {items.map((item) => (
        <figure key={item.id} className="reveal">
          <BeforeAfter item={item} />
          <figcaption className="mt-3.5 flex justify-between gap-3 text-[0.86rem]">
            <strong>{item.title}</strong>
            <span className="text-muted-foreground">{item.label}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
