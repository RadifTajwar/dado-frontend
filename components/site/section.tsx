import { cn } from "@/lib/utils"

const TONES = {
  plain: "",
  alt: "bg-alt",
  ink: "bg-panel text-panel-foreground",
} as const

/* A full-width page band with the standard vertical rhythm and a centred container. */
export function Section({
  tone = "plain",
  tight = false,
  id,
  className,
  children,
}: {
  tone?: keyof typeof TONES
  tight?: boolean
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(tight ? "py-[clamp(52px,7vw,88px)]" : "py-[clamp(72px,10vw,136px)]", TONES[tone], className)}
    >
      <div className="wrap">{children}</div>
    </section>
  )
}
