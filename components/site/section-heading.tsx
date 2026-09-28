import { cn } from "@/lib/utils"

/* Eyebrow + serif title on the left, optional text or button on the right. */
export function SectionHeading({
  eyebrow,
  title,
  aside,
  className,
}: {
  eyebrow: string
  title?: React.ReactNode
  aside?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-[clamp(36px,5vw,56px)] flex flex-col items-start justify-between gap-8 min-[761px]:flex-row min-[761px]:items-end",
        className,
      )}
    >
      <div className="reveal space-y-4">
        <p className="eyebrow">{eyebrow}</p>
        {title && <h2 className="heading">{title}</h2>}
      </div>
      {aside}
    </div>
  )
}
