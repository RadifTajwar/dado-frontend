"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { NAV_LINKS } from "@/lib/site"
import { cn } from "@/lib/utils"

/* The main menu links. Client-side only to mark the current page. */
export function NavLinks({
  vertical = false,
  onNavigate,
  className,
}: {
  vertical?: boolean
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()

  return (
    <nav aria-label="Main" className={cn("flex", vertical ? "flex-col" : "items-center gap-[30px]", className)}>
      {NAV_LINKS.map(({ href, label }) => {
        const current = href === "/" ? pathname === "/" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={current ? "page" : undefined}
            className={cn(
              "font-medium text-foreground/70 transition-colors hover:text-foreground aria-[current=page]:font-semibold aria-[current=page]:text-foreground",
              vertical
                ? "border-b py-4 text-[1.05rem]"
                : "relative py-1 text-[0.92rem] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-clay after:transition-transform after:duration-250 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100",
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
