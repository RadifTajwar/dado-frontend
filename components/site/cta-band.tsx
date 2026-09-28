import { ButtonLink } from "@/components/site/button-link"
import { Section } from "@/components/site/section"

type Action = { href: string; label: string }

/* The dark closing band on every page: eyebrow, title, intro and two actions. */
export function CtaBand({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
}: {
  eyebrow: string
  title: React.ReactNode
  lede: string
  primary: Action
  secondary: Action
}) {
  return (
    <Section tone="ink">
      <div className="reveal space-y-5 text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="heading">{title}</h2>
        <p className="lede mx-auto">{lede}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-3.5">
          {/* on the ink band, hover inverts to bone instead of vanishing into the panel */}
          <ButtonLink href={primary.href} arrow className="hover:bg-panel-foreground hover:text-panel">
            {primary.label}
          </ButtonLink>
          <ButtonLink href={secondary.href} tone="ghost-ink">
            {secondary.label}
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}
