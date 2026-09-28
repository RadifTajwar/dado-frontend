import { SiteImage, type SiteImages } from "@/components/site/site-image"
import { TextLink } from "@/components/site/text-link"
import { DISCIPLINES } from "@/lib/site"
import type { Discipline } from "@/lib/types"

const CARDS: { discipline: Discipline; items: string[] }[] = [
  {
    discipline: "photo",
    items: [
      "Clipping path & background removal",
      "Ghost mannequin & liquify",
      "Colour correction & matching",
      "Model, skin & beauty retouch",
      "Jewellery & reflective products",
      "Shadow, reflection & masking",
    ],
  },
  {
    discipline: "video",
    items: [
      "Editing & assembly from rushes",
      "Colour grading & LUT matching",
      "Product clean-up & rotoscoping",
      "Motion graphics & lower thirds",
      "Subtitles, captions & burn-ins",
      "Platform cut-downs: 16:9, 9:16, 1:1",
    ],
  },
  {
    discipline: "voice",
    items: [
      "Commercial & explainer reads",
      "E-learning & corporate narration",
      "IVR, prompts & phone systems",
      "30+ languages and accents",
      "Mixing, mastering & noise repair",
      "Sync to picture, broadcast-ready",
    ],
  },
]

/* Home "What we do": one card per discipline, split by hairlines. */
export function ServiceCards({ images }: { images: SiteImages }) {
  return (
    <div className="reveal grid gap-px border bg-border min-[921px]:grid-cols-3">
      {CARDS.map(({ discipline, items }, i) => {
        const { label, long, href } = DISCIPLINES[discipline]
        return (
          <article
            key={discipline}
            className="flex flex-col gap-4 bg-background p-[clamp(26px,3.2vw,38px)] transition-colors duration-300 hover:bg-muted"
          >
            <span className="font-serif text-[0.9rem] tracking-[0.1em] text-clay">
              0{i + 1} / {label}
            </span>
            <SiteImage image={images[discipline]} sizes="(max-width: 920px) 100vw, 33vw" className="aspect-[3/2]" />
            <h3 className="subheading">{long}</h3>
            <ul className="mt-0.5 flex flex-col gap-[9px]">
              {items.map((item) => (
                <li
                  key={item}
                  className="relative pl-[18px] text-[0.9rem] text-foreground/70 before:absolute before:top-[0.62em] before:left-0 before:h-px before:w-[7px] before:bg-clay"
                >
                  {item}
                </li>
              ))}
            </ul>
            <TextLink href={href} className="mt-auto self-start pt-2">
              {label} pricing
            </TextLink>
          </article>
        )
      })}
    </div>
  )
}
