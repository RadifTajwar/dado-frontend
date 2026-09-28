import Link from "next/link"

/* Top of an inner page: breadcrumb, big serif title, intro, optional chips. */
export function PageHeader({
  crumb,
  title,
  lede,
  children,
}: {
  crumb: string
  title: React.ReactNode
  lede: string
  children?: React.ReactNode
}) {
  return (
    <section className="border-b pt-[clamp(48px,7vw,84px)] pb-[clamp(32px,4vw,52px)]">
      <div className="wrap space-y-[18px]">
        <nav aria-label="Breadcrumb" className="text-[0.8rem] tracking-[0.06em] text-muted-foreground">
          <Link href="/" className="relative before:absolute before:inset-x-0 before:-inset-y-1.5 transition-colors hover:text-clay">
            Home
          </Link>
          <span aria-hidden> &nbsp;/&nbsp; </span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <h1 className="display">{title}</h1>
        <p className="lede">{lede}</p>
        {children && <div className="pt-2">{children}</div>}
      </div>
    </section>
  )
}
