"use client"

import Image from "next/image"
import { useState } from "react"

import type { PortfolioItem } from "@/lib/types"

const SIZES = "(max-width: 920px) 100vw, 33vw"
const LABEL =
  "pointer-events-none absolute bottom-3.5 rounded-[2px] px-[11px] py-[5px] text-[0.68rem] font-semibold tracking-[0.14em] uppercase"

/* Drag (or arrow-key) comparison slider. The "before" photo sits on top and is
   clipped to the handle position; the server renders it at 50%, so nothing moves on load. */
export function BeforeAfter({ item }: { item: PortfolioItem }) {
  const [pos, setPos] = useState(50)

  return (
    <div
      className="relative aspect-[3/2] touch-pan-y overflow-hidden rounded-[2px] bg-muted select-none has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-clay"
      style={{ "--pos": `${pos}%` } as React.CSSProperties}
    >
      <Image src={item.afterUrl} alt={`${item.alt}, after`} fill sizes={SIZES} className="object-cover" />
      <div className="absolute inset-0 [clip-path:inset(0_calc(100%-var(--pos))_0_0)]">
        <Image src={item.beforeUrl} alt={`${item.alt}, before`} fill sizes={SIZES} className="object-cover" />
      </div>

      {/* the divider line and its round handle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-(--pos) w-0.5 -translate-x-px bg-[#f3f0ea] after:absolute after:top-1/2 after:left-1/2 after:size-[42px] after:-translate-1/2 after:rounded-full after:border-2 after:border-[#f3f0ea] after:bg-[#17150f]/30 after:backdrop-blur-[2px]"
      />
      <span aria-hidden className={`${LABEL} left-3.5 bg-[#17150f]/72 text-[#f3f0ea]`}>
        Before
      </span>
      <span aria-hidden className={`${LABEL} right-3.5 bg-clay text-clay-foreground`}>
        After
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Compare before and after: ${item.title}`}
        className="absolute inset-0 m-0 size-full cursor-ew-resize appearance-none opacity-0"
      />
    </div>
  )
}
