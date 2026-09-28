import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

/* Re-render every public page at least once a day, so pages without data
   (Contact, Free trial) still pick up the new year in the footer. Pages whose
   data is cached for 10 minutes keep that: the shortest time wins. */
export const revalidate = 86400

/* Chrome for the public pages. The admin lives outside this route group. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-[2px] focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
