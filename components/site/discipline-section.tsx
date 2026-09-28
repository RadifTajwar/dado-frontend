import { Chips } from "@/components/site/chips"
import { Price, PriceTable } from "@/components/site/price-table"
import { groupByCaption, unitNote } from "@/components/site/pricing"
import { SiteImage } from "@/components/site/site-image"
import { DISCIPLINES } from "@/lib/site"
import type { Discipline, MediaImage, Service } from "@/lib/types"
import { cn } from "@/lib/utils"

export type DisciplineCopy = {
  title: string
  body: string
  unitNote?: string // appended to each table caption, e.g. "priced per finished minute"
  chips?: string[]
  note: string
}

/* One discipline on the services page: sticky intro + photo on the left,
   its price tables (from the API) on the right. */
export function DisciplineSection({
  discipline,
  index,
  copy,
  services,
  image,
}: {
  discipline: Discipline
  index: number
  copy: DisciplineCopy
  services: Service[]
  image?: MediaImage
}) {
  return (
    <article
      id={discipline}
      className={cn("scroll-mt-24", index > 0 && "mt-[clamp(64px,9vw,120px)] border-t pt-[clamp(64px,9vw,120px)]")}
    >
      {/* grid-cols-1 = minmax(0, 1fr): a wide table scrolls inside its box instead of widening the page */}
      <div className="grid grid-cols-1 items-start gap-[clamp(32px,5vw,72px)] min-[861px]:grid-cols-[0.85fr_1.15fr]">
        <div className="min-w-0 min-[861px]:sticky min-[861px]:top-[104px]">
          <div className="mb-[22px] flex flex-wrap items-baseline gap-[18px]">
            <span className="font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-input">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="eyebrow">{DISCIPLINES[discipline].long}</span>
          </div>
          <h2 className="heading reveal">{copy.title}</h2>
          <p className="reveal mt-5 max-w-[68ch] leading-[1.72] text-foreground/70">{copy.body}</p>
          <SiteImage image={image} sizes="(max-width: 860px) 100vw, 40vw" className="reveal mt-7 aspect-[4/5]" />
        </div>

        <div className="reveal min-w-0 space-y-11">
          {groupByCaption(services).map(([group, list]) => (
            <PriceTable
              key={group}
              caption={copy.unitNote ? `${group} — ${copy.unitNote}` : group}
              headers={["Service", "Typical use", "Price"]}
              rows={list.map((s) => ({ id: s.id, cells: [s.name, s.use, <Price key="price" rate={s.rate} unit={unitNote(s)} />] }))}
            />
          ))}
          {copy.chips && <Chips items={copy.chips} />}
          <p className="text-[0.86rem] leading-[1.55] text-muted-foreground">{copy.note}</p>
        </div>
      </div>
    </article>
  )
}
