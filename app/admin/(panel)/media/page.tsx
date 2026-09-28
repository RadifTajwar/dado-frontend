import type { Metadata } from "next"

import { MediaView } from "@/components/admin/media/media-view"
import { API } from "@/lib/api/endpoints"
import { getAdmin } from "@/lib/api/server"
import type { MediaImage, PortfolioItem } from "@/lib/types"

export const metadata: Metadata = { title: "Site images" }

export default async function MediaPage() {
  // Media has no admin-only list; the public one returns every slot and is read fresh here.
  const [media, portfolio] = await Promise.all([
    getAdmin<MediaImage[]>(API.media),
    getAdmin<PortfolioItem[]>(API.admin.portfolio),
  ])
  return <MediaView media={media} portfolio={portfolio} />
}
