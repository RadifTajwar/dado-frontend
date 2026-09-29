"use client"

import { EllipsisIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

/* The "⋯" button at the end of a table row, holding the less-used actions so
   a row never gets wider than the table. Put DropdownMenuItems inside.
   modal={false} so a dialog opened from an item gets focus and clicks normally. */
export function RowMenu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={label}>
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
