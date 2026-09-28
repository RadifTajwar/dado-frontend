import Image from "next/image"

import type { MediaImage, MediaSlot } from "@/lib/types"
import { cn } from "@/lib/utils"

export type SiteImages = Partial<Record<MediaSlot, MediaImage>>

/** MediaImage[] from the API → lookup by slot. */
export function bySlot(images: MediaImage[]): SiteImages {
  return Object.fromEntries(images.map((image) => [image.slot, image]))
}

/* An admin-managed photo in a fixed-ratio frame (pass the ratio in className),
   so the page never shifts while it loads. Renders nothing if the slot is empty. */
export function SiteImage({
  image,
  sizes,
  preload = false,
  className,
}: {
  image?: MediaImage
  sizes: string
  preload?: boolean
  className?: string
}) {
  if (!image) return null
  return (
    <div className={cn("relative overflow-hidden rounded-[2px] bg-muted", className)}>
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover dark:brightness-92 dark:contrast-102"
      />
    </div>
  )
}
