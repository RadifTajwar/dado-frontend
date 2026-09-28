import type { Metadata } from "next"

import { ServicesView } from "@/components/admin/services/services-view"
import { API } from "@/lib/api/endpoints"
import { getAdmin } from "@/lib/api/server"
import type { Job, Service } from "@/lib/types"

export const metadata: Metadata = { title: "Services" }

export default async function ServicesPage() {
  const [services, jobs] = await Promise.all([getAdmin<Service[]>(API.admin.services), getAdmin<Job[]>(API.admin.jobs)])
  return <ServicesView services={services} jobs={jobs} />
}
