import { EmptyState } from "@/components/admin/empty-state"
import { StatusBadge } from "@/components/admin/status-badge"
import type { FeedItem } from "@/lib/admin/stats"
import { timeAgo } from "@/lib/format"

/* Latest jobs, trials and messages in one list. */
export function ActivityFeed({ items }: { items: FeedItem[] }) {
  if (items.length === 0) return <EmptyState title="Nothing yet" description="Jobs, trials and messages will show up here." />

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-105 text-[0.86rem]">
        <tbody>
          {items.map((f, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
              <td className="w-26 px-4 py-2.5">
                <StatusBadge>{f.kind}</StatusBadge>
              </td>
              <td className="px-3 py-2.5">
                {f.kind === "Trial" && "Trial from "}
                {f.kind === "Message" && "Message from "}
                <b className="font-semibold">{f.title}</b>
                {f.kind === "Job" ? " — " : " · "}
                {f.detail}
              </td>
              <td className="px-4 py-2.5 text-right whitespace-nowrap text-muted-foreground">{timeAgo(f.at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
