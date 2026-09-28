import type { Metadata } from "next"

import { ContactForm } from "@/components/site/contact-form"
import { ContactInfo } from "@/components/site/contact-info"
import { CtaBand } from "@/components/site/cta-band"
import { FormCard } from "@/components/site/form-card"
import { PageHeader } from "@/components/site/page-header"
import { Section } from "@/components/site/section"
import { TextLink } from "@/components/site/text-link"
import { SITE, TRIAL_HREF } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact — Quotes, Scope & Volume Pricing",
  description:
    "Message a DADO producer about photo, video or voice over work. Quotes, volume pricing, NDAs and scope questions answered within 30 minutes, 24/7.",
}

const SMALL = "text-base leading-[1.55] text-muted-foreground min-[641px]:text-[0.86rem]"

const DETAILS = [
  { term: "Email", detail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> },
  { term: "New business", detail: <a href={`mailto:${SITE.quotesEmail}`}>{SITE.quotesEmail}</a> },
  { term: "Phone & WhatsApp", detail: <a href={SITE.phoneHref}>{SITE.phone}</a> },
  {
    term: "Studio",
    detail: (
      <address className={`not-italic ${SMALL}`}>
        {SITE.address.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
    ),
  },
  {
    term: "Hours",
    detail: (
      <span className={SMALL}>
        Three shifts, seven days.
        <br />
        Someone is on the desk at any hour.
      </span>
    ),
  },
  { term: "Response time", detail: <span className={SMALL}>Under 30 minutes for quotes and scope questions.</span> },
  { term: "Send files", detail: <TextLink href={TRIAL_HREF}>Free trial form</TextLink> },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumb="Contact"
        title={
          <>
            Talk to a producer,
            <br />
            not a form robot.
          </>
        }
        lede="Quotes, scope questions, volume pricing, NDAs, or a second opinion on whether something is even worth outsourcing. A person reads every message and replies within 30 minutes, around the clock."
      />

      <Section>
        <div className="grid items-start gap-[clamp(32px,5vw,72px)] min-[901px]:grid-cols-[1.25fr_0.75fr]">
          <FormCard>
            <ContactForm />
          </FormCard>
          <aside aria-label="Contact details">
            <ContactInfo items={DETAILS} />
          </aside>
        </div>
      </Section>

      <CtaBand
        eyebrow="Faster route"
        title="Honestly, just send the files."
        lede="A five-file trial answers more questions than any email thread will. It costs nothing and you will have the work back tomorrow."
        primary={{ href: TRIAL_HREF, label: "Start a free trial" }}
        secondary={{ href: "/services#pricing", label: "See the price list" }}
      />
    </>
  )
}
