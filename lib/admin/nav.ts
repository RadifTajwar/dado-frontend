/* The admin sections, in sidebar order. The header reads its title from here
   too, so each page's name lives in exactly one place. Client-only (icons). */

import { ImageIcon, InboxIcon, LayersIcon, LayoutGridIcon, MailIcon, UsersIcon, type LucideIcon } from "lucide-react"

import type { AdminCounts } from "@/lib/types"

export type AdminNavItem = {
  href: string
  label: string // sidebar
  title: string // page header
  sub: string
  icon: LucideIcon
  count?: keyof AdminCounts // badge in the sidebar
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", title: "Dashboard", sub: "Everything at a glance", icon: LayoutGridIcon },
  {
    href: "/admin/clients",
    label: "Clients",
    title: "Clients",
    sub: "Everyone who has paid you, and what they owe",
    icon: UsersIcon,
    count: "clients",
  },
  {
    href: "/admin/trials",
    label: "Trials",
    title: "Trial requests",
    sub: "Incoming free-trial submissions",
    icon: InboxIcon,
    count: "unreadTrials",
  },
  {
    href: "/admin/contacts",
    label: "Contacts",
    title: "Contact messages",
    sub: "Submissions from the public contact form",
    icon: MailIcon,
    count: "unreadContacts",
  },
  {
    href: "/admin/services",
    label: "Services",
    title: "Services",
    sub: "What you sell, what it costs, what is live",
    icon: LayersIcon,
    count: "activeServices",
  },
  {
    href: "/admin/media",
    label: "Media",
    title: "Site images",
    sub: "Page images and before / after pairs on the public site",
    icon: ImageIcon,
  },
]

export function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`)
}
