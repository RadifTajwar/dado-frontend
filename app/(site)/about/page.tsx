import type { Metadata } from "next"

import { CtaBand } from "@/components/site/cta-band"
import { FeatureGrid } from "@/components/site/feature-grid"
import { PageHeader } from "@/components/site/page-header"
import { Section } from "@/components/site/section"
import { SectionHeading } from "@/components/site/section-heading"
import { bySlot, SiteImage } from "@/components/site/site-image"
import { StatStrip } from "@/components/site/stat-strip"
import { Steps } from "@/components/site/steps"
import { ValueList } from "@/components/site/value-list"
import { API, PUBLIC_TAGS } from "@/lib/api/endpoints"
import { getPublic } from "@/lib/api/server"
import { TRIAL_HREF } from "@/lib/site"
import type { MediaImage } from "@/lib/types"

export const metadata: Metadata = {
  title: "About — A Post-Production Floor in Dhaka",
  description:
    "DADO is a 60-person photo, video and voice post-production studio running three shifts in Dhaka. Published prices, pay after delivery, hand work not filters.",
}

const STATS = [
  { value: "60+", label: "Specialists on staff" },
  { value: "3,000+", label: "Files a day, sustained" },
  { value: "3", label: "Shifts, seven days" },
  { value: "30+", label: "Voice languages" },
]

const DESKS = [
  {
    title: "The stills floor",
    body: "Path, mask, retouch and colour. Every file passes a second operator before it leaves, checking against your reference rather than against taste.",
  },
  {
    title: "The edit suite",
    body: "Calibrated grading monitors, Resolve and Premiere, project files delivered on request. Built for cut-downs at volume, not for one prestige film a quarter.",
  },
  {
    title: "The booth",
    body: "Two treated rooms and a roster of working voice artists across 30+ languages. Real reads, two free pickup sessions, sync to picture in-house.",
  },
  {
    title: "The producer",
    body: "One named contact who owns your brief end to end, answers within 30 minutes, and is the person you complain to when something is wrong.",
  },
]

const COMMITMENTS = [
  {
    title: "Prices stay published",
    body: "Every rate is on the services page and stays there. If we put them up, existing clients hear about it before the website does.",
  },
  {
    title: "You pay after delivery",
    body: "No deposit and no retainer, for anyone, ever. If the work is not right you do not pay for it — that is the only leverage worth giving a client.",
  },
  {
    title: "Your files are yours",
    body: "Deleted 30 days after delivery by default or immediately on request. Nothing appears in a portfolio, a case study or a pitch deck without written permission. NDA signed before files move, whenever you want one.",
  },
  {
    title: "Hand work stays hand work",
    body: "Automation is used where it genuinely beats a person — batch renaming, format conversion, first-pass denoise. It does not get used to draw a path and then sold to you as manual.",
  },
  {
    title: "We say no when we should",
    body: "If a brief needs a specialist we do not have, or a deadline we cannot hit properly, you get told on the first reply rather than on the delivery date.",
  },
]

const CLIENT_TYPES = [
  {
    title: "E-commerce & marketplace teams",
    body: "Catalogue volume with a fixed look. Amazon, Shopify and marketplace specs handled as a standing order with a flat monthly rate.",
  },
  {
    title: "Photographers & studios",
    body: "Shoot more, sit at the desk less. White-labelled, delivered in your naming convention, invisible to your client.",
  },
  {
    title: "Agencies",
    body: "Overflow capacity that scales for a pitch week and disappears after. One brief covering stills, cut-downs and the voice track.",
  },
  {
    title: "Brands with an in-house team",
    body: "Your team keeps the creative calls; we take the repetitive tail so they are not spending Friday on 400 background removals.",
  },
]

export default async function AboutPage() {
  const images = bySlot(await getPublic<MediaImage[]>(API.media, PUBLIC_TAGS.media))

  return (
    <>
      <PageHeader
        crumb="About"
        title={
          <>
            A production floor,
            <br />
            not a marketplace.
          </>
        }
        lede="DADO is sixty people in one building in Dhaka, working three shifts on other people's files. No freelancer roulette, no offshore broker in the middle, no AI filter pretending to be a retoucher."
      />

      <Section>
        <div className="grid items-start gap-[clamp(32px,5vw,72px)] min-[861px]:grid-cols-2">
          <div className="reveal max-w-[68ch] space-y-5 leading-[1.72] text-foreground/70 [&_h3]:pt-4 [&_h3]:text-foreground">
            <p>
              Most brands arrive here the same way. The photographer shoots beautifully and hands over 800 raw files.
              The agency needs the hero cut down for six placements by Thursday. Somebody has to narrate the explainer,
              and nobody in the building has a decent microphone. Three problems, three vendors, three invoices, and a
              launch date that is not moving.
            </p>
            <p>
              We built DADO to take all three off the table at once. The stills desk, the edit suite and the booth sit
              in the same building under the same producer, so a campaign comes back matched instead of stitched
              together from strangers.
            </p>
            <h3 className="subheading">What we are good at</h3>
            <p>
              Volume without drift. Anyone can retouch one photo well. Keeping shot 700 identical to shot 1 — same white,
              same shadow weight, same skin — across a catalogue and across a year is the actual job, and it is a systems
              problem more than an artistic one. That is what the QC pass, the shared reference library and the
              named-convention delivery are all for.
            </p>
            <h3 className="subheading">What we are not</h3>
            <p>
              We are not the cheapest. There are shops quoting below $0.20 a path and they get there by running an
              automatic selection and shipping it. We are also not a boutique retoucher charging $40 a file for editorial
              beauty work — if that is the brief, we will tell you honestly and point you somewhere better.
            </p>
            <p>
              We sit in the middle: production-grade hand work, published prices, and a delivery schedule you can build a
              launch around.
            </p>
          </div>
          <div className="reveal min-[861px]:sticky min-[861px]:top-[104px]">
            <SiteImage image={images.about} sizes="(max-width: 860px) 100vw, 45vw" className="aspect-[4/5]" />
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <StatStrip items={STATS} />
      </Section>

      <Section tone="ink">
        <SectionHeading
          eyebrow="Inside the building"
          title="Three desks, one producer."
          aside={
            <p className="lede reveal max-w-[36ch] text-[0.86rem] leading-[1.55]">
              Your brief does not get handed between companies. It gets handed between rooms.
            </p>
          }
        />
        <Steps items={DESKS} />
      </Section>

      <Section>
        <SectionHeading eyebrow="How we work" title="Five commitments we will not quietly drop." />
        <ValueList items={COMMITMENTS} />
      </Section>

      <Section tone="alt">
        <SectionHeading eyebrow="Who briefs us" title="Mostly four kinds of people." />
        <FeatureGrid items={CLIENT_TYPES} />
      </Section>

      <CtaBand
        eyebrow="No pitch needed"
        title="Test the claims with five files."
        lede="Everything on this page is easy to say. The trial is free precisely so you do not have to take any of it on trust."
        primary={{ href: TRIAL_HREF, label: "Start a free trial" }}
        secondary={{ href: "/contact", label: "Talk to a producer" }}
      />
    </>
  )
}
