import type { Metadata } from "next"

import { Chips } from "@/components/site/chips"
import { ContactInfo } from "@/components/site/contact-info"
import { Faq } from "@/components/site/faq"
import { FormCard } from "@/components/site/form-card"
import { PageHeader } from "@/components/site/page-header"
import { Section } from "@/components/site/section"
import { SectionHeading } from "@/components/site/section-heading"
import { Steps } from "@/components/site/steps"
import { TextLink } from "@/components/site/text-link"
import { TrialForm } from "@/components/site/trial-form"
import { FILE_HOSTS } from "@/lib/site"

export const metadata: Metadata = {
  title: "Free Trial — Send a Drive or Dropbox Link",
  description:
    "Try DADO free: 5 photos, one minute of video or 100 words of voice over. Paste a Google Drive, Dropbox, WeTransfer or OneDrive link — no card, no account, reply in 30 minutes.",
}

const STEPS = [
  {
    title: "Share a link",
    body: "Upload wherever you already work, set the link so anyone with it can view, and paste it below. No size limit, nothing to install.",
  },
  {
    title: "We confirm in 30 minutes",
    body: "A producer reads the brief, confirms scope, and tells you exactly when the trial files land. One reply, no sales sequence.",
  },
  {
    title: "Judge the output",
    body: "Photo and voice back within 24 hours, video within 48. Full resolution, no watermark, yours to use whatever you decide next.",
  },
]

const SMALL = "text-base leading-[1.55] text-muted-foreground min-[641px]:text-[0.86rem]"

const SMALL_PRINT = [
  {
    term: "What the trial covers",
    detail: (
      <span className={SMALL}>
        Up to 5 photos, or 1 minute of finished video, or 100 words of voice over. Pick one discipline or split it across
        all three.
      </span>
    ),
  },
  {
    term: "What it costs",
    detail: <span className={SMALL}>Nothing. No card, no account, no obligation to order afterwards.</span>,
  },
  {
    term: "What you get back",
    detail: (
      <span className={SMALL}>
        Full resolution, no watermark, in the format you asked for. Yours to use regardless of what you decide.
      </span>
    ),
  },
  {
    term: "Turnaround",
    detail: (
      <span className={SMALL}>
        24 hours for photo and voice. 48 hours for video. Faster if you ask and we have the desk free.
      </span>
    ),
  },
  {
    term: "Your files",
    detail: (
      <span className={SMALL}>
        Deleted 30 days after delivery by default, or the moment you ask. Never shown in a portfolio without written
        permission.
      </span>
    ),
  },
  { term: "Prefer to talk first?", detail: <TextLink href="/contact">Message a producer</TextLink> },
]

const FAQ = [
  {
    question: "Why a link instead of an upload box?",
    answer:
      "Because you already have the files somewhere. A link means no size cap, no failed 4 GB upload at 90%, and no waiting on a progress bar. It also means you keep control — revoke the link and our access is gone.",
  },
  {
    question: "My folder is private. What sharing setting do you need?",
    answer: (
      <>
        Set it to <em>anyone with the link can view</em>. If your policy will not allow that, send the request anyway and
        note it in the brief — we will reply with a studio email address you can grant access to directly.
      </>
    ),
  },
  {
    question: "Can I split the trial across photo, video and voice?",
    answer:
      "Yes, and most people should. Two photos, twenty seconds of video and a short read tells you far more about a studio than five cut-outs.",
  },
  {
    question: "Will the trial files be watermarked or downsized?",
    answer:
      "No. You get exactly what a paying client gets, at full resolution. A crippled sample would not tell you anything useful.",
  },
  {
    question: "What if the trial is not good enough?",
    answer:
      "Tell us what missed and we will redo it once, free. If the second pass still is not right, we are not the right studio for that work and we will say so plainly rather than chase the account.",
  },
  {
    question: "Do you sign NDAs before the trial?",
    answer:
      "Yes. Tick the box on the form and we will send ours back signed, or sign yours, before anyone opens the link. Standard for unreleased product and embargoed campaigns.",
  },
]

export default function FreeTrialPage() {
  return (
    <>
      <PageHeader
        crumb="Free trial"
        title={
          <>
            Five files.
            <br />
            On us.
          </>
        }
        lede="Paste a link to your files and tell us what you need. Full production quality, no watermark, no card, no account. If you like it we talk about the rest — if you do not, you have lost nothing but a link."
      >
        <Chips items={FILE_HOSTS} variant="tag" />
      </PageHeader>

      <Section tight>
        <Steps items={STEPS} tone="plain" />
      </Section>

      <Section tone="alt" id="free">
        <div className="grid items-start gap-[clamp(32px,5vw,72px)] min-[901px]:grid-cols-[1.25fr_0.75fr]">
          <div>
            <SectionHeading eyebrow="Trial request" title="Tell us what to work on." className="mb-8" />
            <FormCard>
              <TrialForm />
            </FormCard>
          </div>
          <aside aria-label="The small print">
            <SectionHeading eyebrow="The small print" className="mb-7" />
            <ContactInfo items={SMALL_PRINT} />
          </aside>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Trial questions" title="The things people ask first." />
        <Faq items={FAQ} />
      </Section>
    </>
  )
}
