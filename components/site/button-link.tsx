import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TONES = {
  clay: "",
  ghost:
    "border-input bg-transparent shadow-none hover:border-foreground hover:bg-foreground hover:text-background dark:border-input dark:bg-transparent dark:hover:bg-foreground",
  // outline button on the dark ink bands
  "ghost-ink":
    "border-panel-border bg-transparent text-panel-foreground shadow-none hover:border-panel-foreground hover:bg-panel-foreground hover:text-panel dark:border-panel-border dark:bg-transparent dark:hover:bg-panel-foreground",
} as const

/* A link styled as a button: the site's calls to action. */
export function ButtonLink({
  href,
  tone = "clay",
  size = "xl",
  arrow = false,
  className,
  onClick,
  children,
}: {
  href: string
  tone?: keyof typeof TONES
  size?: "lg" | "xl"
  arrow?: boolean
  className?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      asChild
      variant={tone === "clay" ? "clay" : "outline"}
      size={size}
      className={cn("hover:-translate-y-0.5 motion-reduce:hover:translate-y-0", TONES[tone], className)}
    >
      <Link href={href} onClick={onClick}>
        {children}
        {arrow && (
          <span aria-hidden className="transition-transform group-hover/button:translate-x-1">
            →
          </span>
        )}
      </Link>
    </Button>
  )
}
