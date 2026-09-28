import Link from "next/link"

import { EmptyState } from "@/components/admin/empty-state"
import { PersonCell } from "@/components/admin/person-cell"
import { Button } from "@/components/ui/button"
import type { OwingRow } from "@/lib/admin/stats"
import { money } from "@/lib/format"

/* Clients with an unpaid balance, biggest first. */
export function OwingList({ rows }: { rows: OwingRow[] }) {
  if (rows.length === 0) return <EmptyState title="Nothing outstanding" description="Every invoice is settled." />

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-105 text-[0.86rem]">
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="px-4 py-2.5">
                <PersonCell name={c.name} title={c.label} sub={`${c.jobs} job${c.jobs === 1 ? "" : "s"}`} />
              </td>
              <td className="px-3 py-2.5 text-right whitespace-nowrap tabular-nums">
                {money(c.billed)}
                <span className="block text-[0.76rem] text-muted-foreground">billed</span>
              </td>
              <td className="px-3 py-2.5 text-right font-semibold whitespace-nowrap text-bad tabular-nums">
                {money(c.due)}
                <span className="block text-[0.76rem] font-normal text-muted-foreground">due</span>
              </td>
              <td className="px-4 py-2.5 text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/clients?c=${c.id}`}>Open</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
