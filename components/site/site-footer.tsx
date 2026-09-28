import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import { FOOTER_LINKS, SITE } from "@/lib/site"

const HEADING = "mb-[18px] text-[0.74rem] font-semibold tracking-[0.14em] text-clay uppercase"
const LINK = "text-[0.92rem] text-panel-muted transition-colors hover:text-panel-foreground"

function LinkColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className={HEADING}>{title}</h2>
      <ul className="space-y-[11px]">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={LINK}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-panel pt-[clamp(52px,7vw,80px)] pb-7 text-panel-foreground">
      <div className="wrap">
        <div className="grid gap-9 pb-11 min-[521px]:grid-cols-2 min-[861px]:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="DADO — home">
              <Logo />
            </Link>
            <p className="mt-4 max-w-[34ch] text-[0.92rem] text-panel-muted">{SITE.description}</p>
          </div>
          <LinkColumn title="Services" links={FOOTER_LINKS.services} />
          <LinkColumn title="Company" links={FOOTER_LINKS.company} />
          <div>
            <h2 className={HEADING}>Get in touch</h2>
            <ul className="space-y-[11px]">
              <li>
                <a href={`mailto:${SITE.email}`} className={LINK}>
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className={LINK}>
                  {SITE.phone}
                </a>
              </li>
              <li className="text-[0.92rem] text-panel-muted">{SITE.city}</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-panel-border pt-6 text-[0.82rem] text-panel-muted">
          <span>© {new Date().getFullYear()} DADO Post-Production.</span>
          <span>{SITE.responseNote}</span>
        </div>
      </div>
    </footer>
  )
}
