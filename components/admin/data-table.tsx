"use client"

import { useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  SearchIcon,
} from "lucide-react"

import { EmptyState } from "@/components/admin/empty-state"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { pageWindow } from "@/lib/admin/pagination"
import { cn } from "@/lib/utils"

export type Column<T> = {
  id: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  /** Makes the column sortable. Return a number to sort numerically. */
  sortValue?: (row: T) => string | number
  /** Applied to the header and every cell, e.g. "text-right". */
  className?: string
}

type Props<T> = {
  rows: T[]
  columns: Column<T>[]
  rowKey: (row: T) => string
  /** The text the search box matches. Leave out to hide the search box. */
  searchText?: (row: T) => string
  searchLabel?: string
  /** Buttons to the right of the search box. */
  actions?: React.ReactNode
  /** Filters shown between the search row and the table. */
  filters?: React.ReactNode
  rowClassName?: (row: T) => string | undefined
  empty: { title: string; description: string }
}

const PAGE_SIZES = [10, 25, 50, 100]

/* Search, sort and paginate a list that is already in memory. Sorting applies
   to the whole list, not just the visible page. */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  searchText,
  searchLabel = "Search…",
  actions,
  filters,
  rowClassName,
  empty,
}: Props<T>) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<{ id: string; dir: 1 | -1 } | null>(null)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)

  const q = query.trim().toLowerCase()
  const matched = q && searchText ? rows.filter((r) => searchText(r).toLowerCase().includes(q)) : rows
  const sortBy = sort ? columns.find((c) => c.id === sort.id)?.sortValue : undefined
  const sorted = sortBy && sort ? matched.toSorted((a, b) => compare(sortBy(a), sortBy(b)) * sort.dir) : matched

  const pages = Math.max(1, Math.ceil(sorted.length / size))
  const current = Math.min(page, pages)
  const from = (current - 1) * size
  const visible = sorted.slice(from, from + size)

  function toggleSort(id: string) {
    setSort((s) => (s?.id === id && s.dir === 1 ? { id, dir: -1 } : { id, dir: 1 }))
    setPage(1)
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {(searchText || actions) && (
        <div className="flex flex-wrap items-center gap-2">
          {searchText && (
            <InputGroup className="min-w-45 flex-1 basis-56 bg-card">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder={searchLabel}
                aria-label={searchLabel}
              />
            </InputGroup>
          )}
          {actions}
        </div>
      )}

      {filters}

      <div className="min-w-0 overflow-hidden rounded-lg border bg-card">
        {rows.length === 0 ? (
          <EmptyState title={empty.title} description={empty.description} />
        ) : sorted.length === 0 ? (
          <EmptyState title="Nothing here" description="Nothing matches that search or filter." />
        ) : (
          <>
            <Table className="min-w-160 text-[0.86rem]">
              <TableHeader className="bg-muted/60">
                <TableRow className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableHead
                      key={col.id}
                      aria-sort={sort?.id === col.id ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
                      className={cn(
                        "h-10 px-3.5 text-[0.7rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase",
                        col.className,
                      )}
                    >
                      {col.sortValue ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col.id)}
                          className="inline-flex items-center gap-1 tracking-[inherit] uppercase hover:text-foreground"
                        >
                          {col.header}
                          {sort?.id !== col.id ? (
                            <ChevronsUpDownIcon className="size-3 opacity-40" />
                          ) : sort.dir === 1 ? (
                            <ArrowUpIcon className="size-3 text-clay" />
                          ) : (
                            <ArrowDownIcon className="size-3 text-clay" />
                          )}
                        </button>
                      ) : (
                        col.header
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={rowKey(row)} className={rowClassName?.(row)}>
                    {columns.map((col) => (
                      <TableCell key={col.id} className={cn("px-3.5 py-2.5", col.className)}>
                        {col.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-wrap items-center gap-3 border-t px-4 py-3 text-[0.82rem]">
              <p className="text-muted-foreground max-sm:w-full">
                Showing{" "}
                <b className="text-foreground tabular-nums">
                  {from + 1}–{Math.min(from + size, sorted.length)}
                </b>{" "}
                of <b className="text-foreground tabular-nums">{sorted.length}</b>
              </p>
              <label className="flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase sm:ml-auto">
                Rows
                <NativeSelect
                  size="sm"
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value))
                    setPage(1)
                  }}
                  aria-label="Rows per page"
                >
                  {PAGE_SIZES.map((n) => (
                    <NativeSelectOption key={n} value={n}>
                      {n}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </label>
              {pages > 1 && (
                <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
                  <PagerButton label="First page" disabled={current === 1} onClick={() => setPage(1)}>
                    <ChevronsLeftIcon />
                  </PagerButton>
                  <PagerButton label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)}>
                    <ChevronLeftIcon />
                  </PagerButton>
                  {pageWindow(current, pages).map((p, i) =>
                    p === "gap" ? (
                      <span key={`gap-${i}`} className="px-1 text-muted-foreground">
                        …
                      </span>
                    ) : (
                      <Button
                        key={p}
                        type="button"
                        size="icon-sm"
                        variant={p === current ? "clay" : "outline"}
                        aria-current={p === current ? "page" : undefined}
                        className="tabular-nums"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                  <PagerButton label="Next page" disabled={current === pages} onClick={() => setPage(current + 1)}>
                    <ChevronRightIcon />
                  </PagerButton>
                  <PagerButton label="Last page" disabled={current === pages} onClick={() => setPage(pages)}>
                    <ChevronsRightIcon />
                  </PagerButton>
                </nav>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function PagerButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button type="button" size="icon-sm" variant="outline" aria-label={label} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  )
}

function compare(a: string | number, b: string | number) {
  return typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b))
}
