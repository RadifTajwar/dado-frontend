import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { ButtonLink } from "@/components/site/button-link"
import { MobileNav } from "@/components/site/mobile-nav"
import { NavLinks } from "@/components/site/nav-links"
import { TRIAL_HREF } from "@/lib/site"

/* Sticky header. The "scrolled" hairline is pure CSS (.site-header in styles/site.css). */
export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-transparent bg-background backdrop-blur-[10px]">
      <div className="wrap flex h-[66px] items-center gap-2 min-[901px]:h-[76px] min-[901px]:gap-6">
        <Link href="/" aria-label="DADO — home" className="mr-auto min-w-0">
          <Logo />
        </Link>
        <NavLinks className="hidden min-[901px]:flex" />
        <MobileNav className="min-[901px]:hidden" />
        <ThemeToggle className="bg-transparent dark:bg-transparent" />
        <ButtonLink href={TRIAL_HREF} size="lg" className="hidden px-5 text-[0.84rem] font-semibold min-[901px]:inline-flex">
          Start free trial
        </ButtonLink>
      </div>
    </header>
  )
}
