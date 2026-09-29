import type { Metadata } from "next"

import { PageHeader } from "@/components/site/page-header"
import { Section } from "@/components/site/section"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy",
  description: "What DADO collects through this website, why, where it is kept, and how to have it deleted.",
}

/* Plain-language privacy notice. Keep it true to what the site actually does:
   if a form field, cookie or service provider changes, update this page. */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        crumb="Privacy"
        title="Your details, handled plainly."
        lede="What we collect through this website, why we collect it, where it is kept, and how to have it deleted."
      />

      <Section>
        <div className="max-w-[68ch] space-y-5 leading-[1.72] text-foreground/70 [&_h2]:pt-6 [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          <h2 className="subheading">What we collect</h2>
          <ul>
            <li>
              <strong className="text-foreground">Contact form:</strong> your name, email address, phone number
              (optional), the service you ask about and your message.
            </li>
            <li>
              <strong className="text-foreground">Free-trial form:</strong> your name, work email, company and phone
              (both optional), the services you need, the link to your files, rough volume, deadline, your brief and
              whether you need an NDA.
            </li>
          </ul>
          <p>We don&apos;t use analytics, advertising or tracking cookies.</p>

          <h2 className="subheading">Why we use it</h2>
          <p>
            To reply to you, prepare a quote, run your free trial and deliver the work. We never sell your details or
            share them with anyone for marketing.
          </p>

          <h2 className="subheading">Where it is kept</h2>
          <p>
            Form submissions are stored in our database on MongoDB Atlas (hosted by Amazon Web Services in Hong Kong).
            The website runs on Vercel and our server on Render. Emails about your enquiry are sent through Google
            (Gmail), and images shown on this website are stored with Cloudinary.
          </p>

          <h2 className="subheading">Your files</h2>
          <p>
            We open the link you share only to do the work you asked for. Files are deleted 30 days after delivery, or
            as soon as you ask, and nothing appears in a portfolio without your written permission.
          </p>

          <h2 className="subheading">How long we keep your details</h2>
          <p>
            For as long as they are useful for working with you and for our records. Ask us and we will delete them.
          </p>

          <h2 className="subheading">Cookies</h2>
          <p>
            The public website sets no cookies. If you switch between light and dark mode, that choice is saved in your
            own browser only. The admin area uses one sign-in cookie for our staff.
          </p>

          <h2 className="subheading">Google account data</h2>
          <p>
            We use the Gmail API only to send emails from our own studio account. We do not read, store or share
            anyone&apos;s Gmail data.
          </p>

          <h2 className="subheading">Your choices</h2>
          <p>
            To see, correct or delete what we hold about you, email{" "}
            <a href={`mailto:${SITE.email}`} className="text-clay underline-offset-4 hover:underline">
              {SITE.email}
            </a>
            . We reply within 30 minutes, any hour.
          </p>

          <p className="pt-4 text-[0.86rem] text-muted-foreground">Last updated 29 September 2026.</p>
        </div>
      </Section>
    </>
  )
}
