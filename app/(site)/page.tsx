import { BeforeAfterGrid } from "@/components/site/before-after-grid"
import { ButtonLink } from "@/components/site/button-link"
import { CtaBand } from "@/components/site/cta-band"
import { Faq } from "@/components/site/faq"
import { FeatureGrid } from "@/components/site/feature-grid"
import { HomeHero } from "@/components/site/home-hero"
import { Price, PriceTable } from "@/components/site/price-table"
import { sortServices, unitNote } from "@/components/site/pricing"
import { Section } from "@/components/site/section"
import { SectionHeading } from "@/components/site/section-heading"
import { ServiceCards } from "@/components/site/service-cards"
import { bySlot } from "@/components/site/site-image"
import { StatStrip } from "@/components/site/stat-strip"
import { Steps } from "@/components/site/steps"
import { API, PUBLIC_TAGS } from "@/lib/api/endpoints"
import { getPublic } from "@/lib/api/server"
import { DISCIPLINES, TRIAL_HREF } from "@/lib/site"
import type { MediaImage, PortfolioItem, Service } from "@/lib/types"

const STATS = [
  { value: "3,000+", label: "Files a day" },
  { value: "$0.30", label: "From, per image" },
  { value: "24h", label: "Standard turnaround" },
  { value: "60+", label: "In-house specialists" },
]

const PROCESS = [
  {
    title: "Send a link",
    body: "Drop a Drive, Dropbox, WeTransfer or OneDrive link with your files. Nothing to install, no upload limits to worry about.",
  },
  {
    title: "Agree the brief",
    body: "We reply within 30 minutes with a fixed quote, a turnaround time and any questions about the spec.",
  },
  {
    title: "We produce",
    body: "Your files go to the right desk — photo, video or voice — and through a second-pair-of-eyes QC before they leave.",
  },
  {
    title: "Review & revise",
    body: "Delivered back the way you want them, named to your convention. Revisions are free until it is right.",
  },
]

const WHY = [
  {
    title: "Pay after delivery",
    body: "No deposit, no retainer, no lock-in. You see the work, then you pay the invoice. First trial is free either way.",
  },
  {
    title: "Published pricing",
    body: "Every rate is on the site. No “contact us for a quote” on a $0.30 cut-out — you can budget a campaign before you brief it.",
  },
  {
    title: "Hand work, not filters",
    body: "Paths are drawn with the pen tool, grades are shot-matched by an operator. Automation gets used where it is genuinely better, and nowhere else.",
  },
  {
    title: "NDA and deletion on request",
    body: "Unreleased product, embargoed campaigns, talent footage. Signed NDA before files move, and permanent deletion on your word.",
  },
  {
    title: "One brief, three disciplines",
    body: "The stills, the cut-down and the voice track come back matched, because the same producer owns all three.",
  },
  {
    title: "Scales to a catalogue",
    body: "Three thousand files a day, sustained. Peak season does not need a new vendor search.",
  },
]

const FAQ = [
  {
    question: "How do I get files to you?",
    answer:
      "Paste a shared link — Google Drive, Dropbox, WeTransfer, OneDrive, Box, Frame.io or an S3 URL. Make sure the link is set so anyone with it can view, and tell us the deadline. There is nothing to install and no size cap.",
  },
  {
    question: "What does the free trial cover?",
    answer:
      "Up to 5 photos, or one minute of video, or 100 words of voice over. Full production quality, no watermark, no card. It is there so you can judge the work before committing a catalogue to it.",
  },
  {
    question: "How long does a real order take?",
    answer:
      "Standard is 24 hours for photo and voice, 48 for video. Rush is available at a surcharge. Batches above 1,000 files get a scheduled delivery plan so you know what lands when.",
  },
  {
    question: "What do you charge for — the project or the file?",
    answer:
      "Per file for photo and voice, per finished minute for video. Ongoing catalogue work moves to a monthly rate once the volume is predictable, which usually works out cheaper for you.",
  },
  {
    question: "Which formats do you accept?",
    answer:
      "Photo: JPG, PNG, TIFF, PSD, and raw from every current body — CR2, CR3, NEF, ARW, RAF, DNG. Video: MP4, MOV, ProRes, BRAW, R3D, and full project folders. Audio: WAV, AIFF, MP3, plus your script in any format.",
  },
  {
    question: "What happens if I do not like it?",
    answer:
      "Tell us what is wrong and we redo it. Revisions are unlimited and free. If it still is not right, you do not pay the invoice — that is the whole policy.",
  },
  {
    question: "Who owns the files, and do you keep them?",
    answer:
      "You do, entirely. We hold nothing in a portfolio without written permission. Files are deleted 30 days after delivery by default, or immediately on request, and we will sign your NDA before anything moves.",
  },
  {
    question: "What are your working hours?",
    answer:
      "The studio runs three shifts, so someone is on the desk around the clock, seven days. Quotes come back within 30 minutes at any hour.",
  },
]

export default async function HomePage() {
  const [services, media, portfolio] = await Promise.all([
    getPublic<Service[]>(API.services, PUBLIC_TAGS.services),
    getPublic<MediaImage[]>(API.media, PUBLIC_TAGS.media),
    getPublic<PortfolioItem[]>(API.portfolio, PUBLIC_TAGS.portfolio),
  ])
  const images = bySlot(media)
  const featured = sortServices(services.filter((s) => s.featured))

  return (
    <>
      <HomeHero image={images.hero} />

      <Section className="pt-0">
        <StatStrip items={STATS} />
      </Section>

      <Section tone="alt" id="services">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Three studios,
              <br />
              one delivery pipeline.
            </>
          }
          aside={
            <p className="lede reveal max-w-[38ch] text-[0.86rem] leading-[1.55]">
              Brief once, upload once, get everything back together. No juggling three vendors and three invoices.
            </p>
          }
        />
        <ServiceCards images={images} />
      </Section>

      {portfolio.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Recent work"
            title="Drag to see the difference."
            aside={
              <p className="lede reveal max-w-[36ch] text-[0.86rem] leading-[1.55]">
                Real files, unretouched on the left. Everything here was a 24-hour job.
              </p>
            }
          />
          <BeforeAfterGrid items={portfolio} />
        </Section>
      )}

      <Section tone="ink">
        <SectionHeading eyebrow="How it runs" title="Four steps. No account needed to start." />
        <Steps items={PROCESS} />
      </Section>

      <Section>
        <SectionHeading eyebrow="Why teams move to us" title="The boring parts, done properly." />
        <FeatureGrid items={WHY} />
      </Section>

      {featured.length > 0 && (
        <Section tone="alt">
          <SectionHeading
            eyebrow="Pricing"
            title="Rates you can plan around."
            aside={
              <ButtonLink href="/services#pricing" tone="ghost" className="reveal">
                Full price list
              </ButtonLink>
            }
          />
          <div className="reveal">
            <PriceTable
              caption="Most-ordered work"
              headers={["Service", "Discipline", "Typical turnaround", "From"]}
              hideOnPhones={[1]}
              rows={featured.map((s) => ({
                id: s.id,
                cells: [s.name, DISCIPLINES[s.discipline].label, s.turnaround, <Price key="price" rate={s.rate} unit={unitNote(s, true)} />],
              }))}
            />
          </div>
          <p className="mt-[18px] text-[0.86rem] leading-[1.55] text-muted-foreground">
            Volume discounts to 50% on standing orders. Complex paths, heavy retouch and long-form video are quoted per
            file — always before work starts.
          </p>
        </Section>
      )}

      <Section>
        <SectionHeading eyebrow="Questions" title="Before you send anything." />
        <Faq items={FAQ} />
      </Section>

      <CtaBand
        eyebrow="Free trial"
        title="Send five files. Judge for yourself."
        lede="No card, no account, no call. Paste a link, tell us what you need, and see the work before you commit to anything."
        primary={{ href: TRIAL_HREF, label: "Start a free trial" }}
        secondary={{ href: "/contact", label: "Talk to a producer" }}
      />
    </>
  )
}
