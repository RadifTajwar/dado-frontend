import { cookies } from "next/headers"

import { AdminHeader } from "@/components/admin/shell/admin-header"
import { AdminSidebar } from "@/components/admin/shell/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { API } from "@/lib/api/endpoints"
import { getAdmin } from "@/lib/api/server"
import type { AdminCounts } from "@/lib/types"

/* The signed-in admin shell: sidebar + header around every page.
   Toasts and tooltips live here, not in the root layout, so the public
   site never ships their JavaScript. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const [counts, cookieStore] = await Promise.all([getAdmin<AdminCounts>(API.admin.counts), cookies()])
  // shadcn's sidebar remembers open/collapsed in a cookie; reading it here avoids a layout jump.
  const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <AdminSidebar counts={counts} />
        {/* On desktop the admin is exactly one screen tall: the content area scrolls
            on its own (dashboard, media), and list pages let their table fill what's left. */}
        <SidebarInset className="min-w-0 bg-app md:h-svh md:overflow-hidden">
          <AdminHeader />
          <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-6 md:min-h-0 md:overflow-y-auto lg:p-7">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  )
}
