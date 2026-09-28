import type { Metadata } from "next"

import { Chips } from "@/components/site/chips"
import { CtaBand } from "@/components/site/cta-band"
import { DisciplineSection, type DisciplineCopy } from "@/components/site/discipline-section"
import { PageHeader } from "@/components/site/page-header"
import { sortServices } from "@/components/site/pricing"
import { Section } from "@/components/site/section"
import { SectionHeading } from "@/components/site/section-heading"
import { bySlot } from "@/components/site/site-image"
import { ValueList } from "@/components/site/value-list"
import { API, PUBLIC_TAGS } from "@/lib/api/endpoints"
import { getPublic } from "@/lib/api/server"
import { DISCIPLINE_ORDER, TRIAL_HREF } from "@/lib/site"
import type { Discipline, MediaImage, Service } from "@/lib/types"

export const metadata: Metadata = {
  title: "Services & Pricing — Photo, Video & Voice Over",
  description:
    "Full published price list for photo retouching from $0.30, video editing and colour grading from $18 a minute, and studio voice over from $12 per 100 words. Quoted before work starts.",
}

const COPY: Record<Discipline, DisciplineCopy> = {
  photo: {
    title: "Catalogue-ready stills, by hand.",
    body: "Every path is drawn with the pen tool. Every colour is matched against your reference, not auto-levelled. The output is sized, named and profiled for wherever it is going — Amazon, Shopify, a lookbook or a press pack.",
    note: "Per image. Raw conversion included. Complex files are quoted before work starts — never after.",
  },
  video: {
    title: "From rushes to every aspect ratio.",
    body: "Send the card dump and the brief. You get a cut, a grade, the graphics and every platform crop back as one delivery — with the project file if you want to take it in-house later.",
    unitNote: "priced per finished minute",
    chips: ["MP4", "MOV", "ProRes", "BRAW", "R3D", "Premiere / Resolve projects", "Up to 8K"],
    note: "48-hour standard on anything under five minutes. Long-form, series and event work move to a fixed project quote.",
  },
  voice: {
    title: "Booth-recorded reads, mixed to spec.",
    body: "Real voices in a treated booth, not a synthesiser. Pick from the roster or brief a casting. Delivered dry and mixed, cut to picture if you send the video with it.",
    unitNote: "priced per 100 words unless noted",
    chips: ["English — UK / US / AU", "Spanish", "French", "German", "Arabic", "Hindi", "Bengali", "Mandarin", "+22 more"],
    note: "Broadcast usage and buyout are quoted separately. Two free pickup sessions on every booking.",
  },
}

const BILLING = [
  {
    title: "Quoted before, not after",
    body: "Every batch gets a written quote within 30 minutes. If a file turns out harder than it looked, we come back and ask — we never bill a higher tier without agreeing it first.",
  },
  {
    title: "Volume brings the rate down",
    body: "Discounts start at 500 files a month and reach 50% on sustained catalogue work. Standing orders move to a flat monthly rate so your cost per SKU stops moving.",
  },
  {
    title: "You pay after you approve",
    body: "No deposit, no retainer. Invoices go out after delivery on 7-day terms. New clients start with the free trial, so nothing is at risk on either side.",
  },
  {
    title: "Revisions are not billable",
    body: "If the output missed the brief, it gets redone at no charge, as many times as it takes. A genuine change of brief is re-quoted openly.",
  },
  {
    title: "Paid by bank transfer, PayPal, Payoneer or Wise",
    body: "Invoiced in USD, GBP or EUR. Monthly consolidated billing available once you are on a standing order.",
  },
]

export default async function ServicesPage() {
  const [services, media] = await Promise.all([
    getPublic<Service[]>(API.services, PUBLIC_TAGS.services),
    getPublic<MediaImage[]>(API.media, PUBLIC_TAGS.media),
  ])
  const images = bySlot(media)
  const sorted = sortServices(services)

  return (
    <>
      <PageHeader
        crumb="Services"
        title={
          <>
            Everything after
            <br />
            the shutter closes.
          </>
        }
        lede="Three production lines under one roof — stills, moving image and voice. Every rate below is what you actually pay; nothing is hidden behind a discovery call."
      >
        <Chips
          items={[
            "24h photo & voice",
            "48h video",
            "Unlimited free revisions",
            "Pay after delivery",
            "NDA on request",
            "Up to 50% volume discount",
          ]}
        />
      </PageHeader>

      <Section id="pricing" className="scroll-mt-16">
        {DISCIPLINE_ORDER.map((discipline, index) => (
          <DisciplineSection
            key={discipline}
            discipline={discipline}
            index={index}
            copy={COPY[discipline]}
            services={sorted.filter((s) => s.discipline === discipline)}
            image={images[discipline]}
          />
        ))}
      </Section>

      <Section tone="alt">
        <SectionHeading eyebrow="How billing works" title="No surprises on the invoice." />
        <ValueList items={BILLING} />
      </Section>

      <CtaBand
        eyebrow="Try it first"
        title={
          <>
            Pick any service above.
            <br />
            First five files are free.
          </>
        }
        lede="Photo, video or voice — send a link to the files and see the output before you spend anything."
        primary={{ href: TRIAL_HREF, label: "Start a free trial" }}
        secondary={{ href: "/contact", label: "Ask a question first" }}
      />
    </>
  )
}
