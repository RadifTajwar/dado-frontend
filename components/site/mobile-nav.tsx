"use client"

import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Logo } from "@/components/shared/logo"
import { ButtonLink } from "@/components/site/button-link"
import { NavLinks } from "@/components/site/nav-links"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TRIAL_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"

/* Phone menu: a sheet dropping from the top with the links and the trial CTA. */
export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open menu" className={cn("bg-transparent dark:bg-transparent", className)}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" aria-describedby={undefined} className="gap-0 px-[clamp(20px,5vw,48px)] pt-5 pb-7">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <Link href="/" onClick={close} aria-label="DADO — home" className="mb-3 self-start">
          <Logo />
        </Link>
        <NavLinks vertical onNavigate={close} />
        <ButtonLink href={TRIAL_HREF} onClick={close} className="mt-5 w-full">
          Start free trial
        </ButtonLink>
      </SheetContent>
    </Sheet>
  )
}
