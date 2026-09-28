"use client"

import { useState } from "react"

import { AdminCard } from "@/components/admin/admin-card"
import { Button } from "@/components/ui/button"

/* A chart with a "Table view" switch. The table carries the same numbers, so
   nobody has to read values off colours or bar lengths. */
export function ChartCard({
  title,
  sub,
  table,
  children,
}: {
  title: string
  sub: string
  table: { head: string[]; rows: string[][] }
  children: React.ReactNode
}) {
  const [showTable, setShowTable] = useState(false)

  return (
    <AdminCard
      title={title}
      sub={sub}
      action={
        <Button type="button" variant="ghost" size="sm" aria-pressed={showTable} onClick={() => setShowTable((s) => !s)}>
          {showTable ? "Hide table" : "Table view"}
        </Button>
      }
    >
      {children}
      {showTable && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[0.8rem]">
            <thead>
              <tr>
                {table.head.map((h) => (
                  <th
                    key={h}
                    className="border-b px-2.5 py-2 text-left text-[0.72rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b px-2.5 py-2 tabular-nums">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminCard>
  )
}
