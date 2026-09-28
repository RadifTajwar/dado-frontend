import Link from "next/link"

import { cn } from "@/lib/utils"

/* Clay inline link with an arrow, e.g. "Photo pricing →". */
export function TextLink({
  href,
  arrow = true,
  className,
  children,
}: {
  href: string
  arrow?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 border-b border-transparent pb-0.5 text-[0.92rem] font-semibold text-clay transition-colors hover:border-clay",
        className,
      )}
    >
      {children}
      {arrow && <span aria-hidden>→</span>}
    </Link>
  )
}
