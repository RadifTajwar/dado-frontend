"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageIcon, PencilIcon, PlusIcon, XIcon } from "lucide-react"

import { AdminCard } from "@/components/admin/admin-card"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { EmptyState } from "@/components/admin/empty-state"
import { MediaDialog } from "@/components/admin/media/media-dialog"
import { PortfolioDialog } from "@/components/admin/media/portfolio-dialog"
import { StatusBadge } from "@/components/admin/status-badge"
import { ToggleSwitch } from "@/components/admin/toggle-switch"
import { useMutation } from "@/components/admin/use-mutation"
import { Button } from "@/components/ui/button"
import { isAllowedImageUrl } from "@/lib/admin/images"
import { apiFetch } from "@/lib/api/client"
import { API, PUBLIC_TAGS } from "@/lib/api/endpoints"
import type { MediaImage, MediaSlot, PortfolioItem } from "@/lib/types"
import { cn } from "@/lib/utils"

const SLOTS: { slot: MediaSlot; label: string; usage: string; aspect: string }[] = [
  { slot: "hero", label: "Home hero", usage: "Top of the home page", aspect: "aspect-[4/5]" },
  { slot: "about", label: "About", usage: "Beside the studio story on the About page", aspect: "aspect-[4/5]" },
  { slot: "photo", label: "Photo", usage: "Photo card on the home page and the Photo section of Services", aspect: "aspect-[3/2]" },
  { slot: "video", label: "Video", usage: "Video card on the home page and the Video section of Services", aspect: "aspect-[3/2]" },
  { slot: "voice", label: "Voice", usage: "Voice card on the home page and the Voice section of Services", aspect: "aspect-[3/2]" },
]

type Modal = { kind: "slot"; slot: MediaSlot } | { kind: "newPair" } | { kind: "editPair" | "deletePair"; id: string }

export function MediaView({ media, portfolio }: { media: MediaImage[]; portfolio: PortfolioItem[] }) {
  const mutate = useMutation()
  const [modal, setModal] = useState<Modal | null>(null)

  const bySlot = new Map(media.map((m) => [m.slot, m]))
  const pairs = portfolio.toSorted((a, b) => a.order - b.order)
  const slot = modal?.kind === "slot" ? SLOTS.find((s) => s.slot === modal.slot) : undefined
  const pair = modal && "id" in modal ? portfolio.find((p) => p.id === modal.id) : undefined
  const nextOrder = Math.max(0, ...portfolio.map((p) => p.order)) + 1

  return (
    <>
      <AdminCard title="Page images" sub="The fixed photos on the public pages">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4">
          {SLOTS.map((s) => {
            const image = bySlot.get(s.slot)
            return (
              <article key={s.slot} className="flex flex-col gap-2.5">
                <Thumb url={image?.url} alt={image?.alt ?? ""} className={s.aspect} eager />
                <div className="min-w-0">
                  <h3 className="text-[0.9rem] font-semibold">{s.label}</h3>
                  <p className="text-[0.76rem] text-muted-foreground">{s.usage}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-auto"
                  onClick={() => setModal({ kind: "slot", slot: s.slot })}
                >
                  {image ? "Replace" : "Add image"}
                </Button>
              </article>
            )
          })}
        </div>
      </AdminCard>

      <AdminCard
        title="Before / after"
        sub="The “Recent work” sliders on the home page"
        flush
        action={
          <Button type="button" variant="clay" size="sm" onClick={() => setModal({ kind: "newPair" })}>
            <PlusIcon /> Add pair
          </Button>
        }
      >
        {pairs.length === 0 ? (
          <EmptyState title="No pairs yet" description="Add a before and after image to show on the home page." />
        ) : (
          <ul className="divide-y">
            {pairs.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-4 px-4.5 py-3.5">
                <div className="flex gap-2">
                  <Thumb url={p.beforeUrl} alt={`${p.alt} — before`} className="aspect-[3/2] w-24" />
                  <Thumb url={p.afterUrl} alt={`${p.alt} — after`} className="aspect-[3/2] w-24" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-[0.78rem] text-muted-foreground">
                    {p.label} · order {p.order}
                  </p>
                </div>
                <ToggleSwitch
                  key={p.updatedAt}
                  checked={p.active}
                  label={`Show ${p.title} on the home page`}
                  onText="Shown"
                  offText="Hidden"
                  onChange={(active) =>
                    mutate(
                      () => apiFetch(API.admin.portfolioItem(p.id), { method: "PUT", body: { active } }),
                      { success: `${p.title} is now ${active ? "shown" : "hidden"}`, publicTags: [PUBLIC_TAGS.portfolio] },
                    )
                  }
                />
                <div className="flex gap-1">
                  <Button type="button" variant="outline" size="sm" onClick={() => setModal({ kind: "editPair", id: p.id })}>
                    <PencilIcon /> Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${p.title}`}
                    onClick={() => setModal({ kind: "deletePair", id: p.id })}
                  >
                    <XIcon />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      {slot && (
        <MediaDialog
          slot={slot.slot}
          label={slot.label}
          aspect={slot.aspect}
          image={bySlot.get(slot.slot)}
          onDone={() => setModal(null)}
        />
      )}
      {modal?.kind === "newPair" && <PortfolioDialog nextOrder={nextOrder} onDone={() => setModal(null)} />}
      {modal?.kind === "editPair" && pair && <PortfolioDialog item={pair} nextOrder={nextOrder} onDone={() => setModal(null)} />}
      {modal?.kind === "deletePair" && pair && (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && setModal(null)}
          title="Delete this pair?"
          description={`“${pair.title}” comes off the home page. The image files stay in Cloudinary.`}
          onConfirm={async () => {
            const ok = await mutate(() => apiFetch(API.admin.portfolioItem(pair.id), { method: "DELETE" }), {
              success: "Pair deleted",
              publicTags: [PUBLIC_TAGS.portfolio],
            })
            if (ok) setModal(null)
          }}
        />
      )}
    </>
  )
}

/* A cropped preview. Images on hosts next/image can't load are named, not rendered. */
function Thumb({ url, alt, className, eager = false }: { url?: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-md border bg-muted", className)}>
      {url && isAllowedImageUrl(url) ? (
        <Image src={url} alt={alt} fill sizes="240px" loading={eager ? "eager" : undefined} className="object-cover" />
      ) : (
        <div className="grid size-full place-items-center p-2 text-center text-[0.72rem] text-muted-foreground">
          {url ? (
            <StatusBadge tone="bad">Unsupported host</StatusBadge>
          ) : (
            <span className="flex items-center gap-1.5">
              <ImageIcon className="size-4" /> No image
            </span>
          )}
        </div>
      )}
    </div>
  )
}
