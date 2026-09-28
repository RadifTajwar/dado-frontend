import { Skeleton } from "@/components/ui/skeleton"

/* Instant placeholder while a page's data loads; the sidebar stays put. */
export default function Loading() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(165px,1fr))] gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-9 w-full max-w-md" />
      <Skeleton className="h-80 rounded-lg" />
    </div>
  )
}
