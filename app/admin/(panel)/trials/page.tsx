import type { Metadata } from "next"

import { TrialsView } from "@/components/admin/trials/trials-view"
import { API } from "@/lib/api/endpoints"
import { getAdmin } from "@/lib/api/server"
import type { Trial } from "@/lib/types"

export const metadata: Metadata = { title: "Trial requests" }

export default async function TrialsPage() {
  const trials = await getAdmin<Trial[]>(API.admin.trials)
  return <TrialsView trials={trials} />
}
