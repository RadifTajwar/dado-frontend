"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLinkIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { ADMIN_NAV, isActivePath } from "@/lib/admin/nav"
import type { AdminCounts } from "@/lib/types"

// The active item is filled with clay, like the prototype.
const ACTIVE =
  "data-[active=true]:bg-clay data-[active=true]:font-semibold data-[active=true]:text-clay-foreground data-[active=true]:hover:bg-clay data-[active=true]:hover:text-clay-foreground"
const BADGE =
  "rounded-full bg-clay font-bold text-clay-foreground peer-hover/menu-button:text-clay-foreground peer-data-[active=true]/menu-button:bg-clay-foreground peer-data-[active=true]/menu-button:text-clay"

export function AdminSidebar({ counts }: { counts: AdminCounts }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-2 py-4">
        <Link href="/admin" className="flex items-baseline gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <span className="font-serif text-[1.24rem] leading-none tracking-[0.14em] group-data-[collapsible=icon]:hidden">
            DADO
          </span>
          <span className="hidden font-serif text-[1.1rem] leading-none group-data-[collapsible=icon]:inline">D</span>
          <span aria-hidden className="size-1.25 self-center rounded-full bg-clay group-data-[collapsible=icon]:hidden" />
          <span className="text-[9px] leading-none tracking-[0.2em] text-muted-foreground uppercase group-data-[collapsible=icon]:hidden">
            Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <nav aria-label="Admin sections">
              <SidebarMenu>
                {ADMIN_NAV.map((item) => {
                  const count = item.count ? counts[item.count] : 0
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActivePath(pathname, item.href)}
                        tooltip={item.label}
                        className={ACTIVE}
                      >
                        <Link href={item.href} onClick={() => setOpenMobile(false)}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {count > 0 && <SidebarMenuBadge className={BADGE}>{count}</SidebarMenuBadge>}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View public site">
              <Link href="/" target="_blank" rel="noopener">
                <ExternalLinkIcon />
                <span>View public site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
