import type { Metadata } from "next"

import { ButtonLink } from "@/components/site/button-link"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { TRIAL_HREF } from "@/lib/site"

export const metadata: Metadata = { title: "Page not found" }

/* Any URL that matches no page. Lives outside the (site) group, so it brings
   the public header and footer itself. Static: no data to fetch. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap py-[clamp(72px,12vw,160px)]">
        <p className="eyebrow">404</p>
        <h1 className="display mt-5">
          Nothing here.
          <br />
          The files moved on.
        </h1>
        <p className="lede mt-5">
          This page does not exist, or it did once and has since been renamed. Everything we do is one click away from the
          home page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to the home page</ButtonLink>
          <ButtonLink href={TRIAL_HREF} tone="ghost">
            Start a free trial
          </ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
