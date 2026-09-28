import { ButtonLink } from "@/components/site/button-link"
import { SiteImage } from "@/components/site/site-image"
import { TRIAL_HREF } from "@/lib/site"
import type { MediaImage } from "@/lib/types"

/* Home page opener. The photo is the largest thing on screen, so it is preloaded. */
export function HomeHero({ image }: { image?: MediaImage }) {
  return (
    <section className="pt-[clamp(56px,9vw,104px)] pb-[clamp(48px,7vw,80px)]">
      <div className="wrap grid items-center gap-[clamp(32px,5vw,72px)] min-[861px]:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-[22px]">
          <p className="eyebrow">Photo · Video · Voice Over</p>
          <h1 className="display">
            Raw files in.
            <br />
            Retail-ready work <em className="text-clay italic">out</em>.
          </h1>
          <p className="lede">
            A single post-production partner for e-commerce brands, photographers and agencies. Cut-outs, retouching and
            colour. Edits, grades and captions. Studio voice over in 30+ languages. Back to you in 24 hours.
          </p>
          <div className="flex flex-wrap gap-3 pt-2.5">
            <ButtonLink href={TRIAL_HREF} arrow>
              Start a free trial
            </ButtonLink>
            <ButtonLink href="/services" tone="ghost">
              See what we do
            </ButtonLink>
          </div>
          <p className="flex items-center gap-2 text-[0.84rem] text-muted-foreground">
            <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-clay" />5 files free · No card · Quote back
            within 30 minutes
          </p>
        </div>

        {image && (
          <figure className="relative max-[860px]:order-first">
            <SiteImage
              image={image}
              preload
              sizes="(max-width: 860px) 100vw, 46vw"
              className="aspect-[16/11] min-[861px]:aspect-[4/5]"
            />
            <figcaption className="absolute right-3.5 bottom-3.5 max-w-[220px] rounded-[2px] border border-l-2 border-l-clay bg-background px-[18px] py-[13px] min-[861px]:right-auto min-[861px]:bottom-[26px] min-[861px]:-left-3.5">
              <b className="block font-serif text-[1.5rem] leading-none font-normal">24h</b>
              <span className="text-[0.74rem] tracking-[0.09em] text-muted-foreground uppercase">Standard delivery</span>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  )
}
