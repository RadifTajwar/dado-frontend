import { SITE } from "@/lib/site"
import { cn } from "@/lib/utils"

/* The DADO wordmark: serif letters, a clay dot, and the small "Post Production" line. */
export function Logo({ className, withTagline = true }: { className?: string; withTagline?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-serif text-[1.42rem] leading-none tracking-[0.14em]">{SITE.name}</span>
      <span aria-hidden className="size-1.5 self-center rounded-full bg-clay" />
      {withTagline && (
        <span className="text-[9.5px] leading-none tracking-[0.24em] uppercase opacity-60">{SITE.tagline}</span>
      )}
    </span>
  )
}
