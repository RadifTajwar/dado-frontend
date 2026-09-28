"use client"

import { usePathname } from "next/navigation"

import { SignOutButton } from "@/components/admin/shell/sign-out-button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ADMIN_NAV, isActivePath } from "@/lib/admin/nav"

/* Sticky top bar. The page title comes from the nav config, so pages don't repeat it. */
export function AdminHeader() {
  const pathname = usePathname()
  const page = ADMIN_NAV.find((item) => isActivePath(pathname, item.href))

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-app/85 px-4 backdrop-blur-md sm:px-6 lg:px-7">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <div className="min-w-0">
        <h1 className="truncate text-[1.05rem] font-semibold tracking-[-0.01em]">{page?.title ?? "Admin"}</h1>
        {page && <p className="hidden truncate text-[0.82rem] text-muted-foreground sm:block">{page.sub}</p>}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <SignOutButton />
      </div>
    </header>
  )
}
