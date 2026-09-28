"use client"

import { useEffect, useRef } from "react"

/* Replaces a form once it has been sent. Takes focus (so screen readers hear it)
   and scrolls into view. */
export function FormSuccess({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches
    ref.current?.focus({ preventScroll: true })
    ref.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" })
  }, [])

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="animate-in rounded-[2px] border border-clay bg-clay-soft px-5 py-[clamp(34px,6vw,64px)] text-center outline-none duration-500 fade-in-0 slide-in-from-bottom-2"
    >
      <div
        aria-hidden
        className="mx-auto mb-5 grid size-[50px] place-items-center rounded-full bg-clay text-[1.3rem] text-clay-foreground"
      >
        ✓
      </div>
      <h3 className="mb-2.5 font-serif text-[1.55rem] font-normal">{title}</h3>
      <p className="mx-auto max-w-[46ch] text-[0.95rem] text-foreground/70">{children}</p>
    </div>
  )
}
