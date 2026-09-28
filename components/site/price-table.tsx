import { money } from "@/lib/format"
import { cn } from "@/lib/utils"

const CELL = "border-b px-3.5 py-[13px] text-left"

/* A captioned price table. The last column is the price: right-aligned, clay.
   `hideOnPhones` lists column indexes to drop below 640px, so the price stays
   on screen without sideways scrolling. */
export function PriceTable({
  caption,
  headers,
  rows,
  hideOnPhones = [],
}: {
  caption: string
  headers: string[]
  rows: { id: string; cells: React.ReactNode[] }[]
  hideOnPhones?: number[]
}) {
  const last = headers.length - 1
  const phoneHidden = (i: number) => hideOnPhones.includes(i) && "max-sm:hidden"

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[0.93rem]">
        <caption className="pb-4 text-left text-[0.78rem] font-semibold tracking-[0.14em] text-clay uppercase">
          {caption}
        </caption>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={header}
                scope="col"
                className={cn(
                  CELL,
                  "text-[0.74rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase",
                  i === last && "text-right",
                  phoneHidden(i),
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-muted">
              {row.cells.map((cell, i) => (
                <td
                  key={i}
                  className={cn(
                    CELL,
                    i === last && "text-right font-semibold whitespace-nowrap text-clay tabular-nums",
                    phoneHidden(i),
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* "$180.00" with the unit on a smaller line underneath ("per finished hour"),
   so long units don't widen the price column. */
export function Price({ rate, unit }: { rate: number; unit?: string }) {
  return (
    <>
      {money(rate)}
      {unit && <span className="block text-[0.74rem] font-normal text-muted-foreground">{unit}</span>}
    </>
  )
}
