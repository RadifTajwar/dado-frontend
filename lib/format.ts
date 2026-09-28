/* Display helpers. Dates use the studio's time zone so the server render and
   the browser always agree (no hydration mismatch). */

const TZ = "Asia/Dhaka"

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: TZ })
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }) // → YYYY-MM-DD

/** $1,230.00 */
export const money = (n: number) => usd.format(n || 0)

/** $1,230 */
export const money0 = (n: number) => usd0.format(n || 0)

/** "YYYY-MM-DD" or an ISO timestamp → "24 Sep 2026" */
export function formatDate(value: string) {
  return day.format(toDate(value))
}

/** Today's date in the studio's time zone, as "YYYY-MM-DD". */
export const today = () => dayKey.format(new Date())

/** "today", "yesterday", "5 days ago", "3 mo ago", "2 yr ago" */
export function timeAgo(value: string) {
  const days = Math.round((Date.parse(today()) - Date.parse(dayKey.format(toDate(value)))) / 864e5)
  if (days <= 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} mo ago`
  return `${Math.floor(days / 365)} yr ago`
}

/** "Nora Beckett" → "NB" */
export function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
  return letters.toUpperCase() || "?"
}

/** "https://www.dropbox.com/x" → "dropbox.com" ("" when not a URL) */
export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

/** Only http(s) URLs are safe to put in an href. */
export const isSafeUrl = (url: string) => /^https?:\/\//i.test(url)

// A plain "YYYY-MM-DD" is a calendar day in the studio; pin it to noon there.
function toDate(value: string) {
  return new Date(value.length === 10 ? `${value}T12:00:00+06:00` : value)
}
