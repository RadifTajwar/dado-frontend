/* Windowed page numbers for the table footer: 1 … 4 5 6 … 12.
   "gap" marks where the ellipsis goes. */

export type PageItem = number | "gap"

export function pageWindow(current: number, total: number): PageItem[] {
  if (total <= 1) return []
  const pages = new Set([1, total, current - 1, current, current + 1])
  if (current <= 3) [2, 3, 4].forEach((n) => pages.add(n))
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((n) => pages.add(n))

  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const out: PageItem[] = []
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap")
    out.push(n)
  })
  return out
}
