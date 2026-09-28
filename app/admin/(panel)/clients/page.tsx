import type { Metadata } from "next"

import { ClientsView } from "@/components/admin/clients/clients-view"
import { API } from "@/lib/api/endpoints"
import { getAdmin } from "@/lib/api/server"
import type { Client, Job, Service } from "@/lib/types"

export const metadata: Metadata = { title: "Clients" }

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ c?: string | string[] }> }) {
  const [{ c }, clients, jobs, services] = await Promise.all([
    searchParams,
    getAdmin<Client[]>(API.admin.clients),
    getAdmin<Job[]>(API.admin.jobs),
    getAdmin<Service[]>(API.admin.services),
  ])

  return <ClientsView clients={clients} jobs={jobs} services={services} openId={typeof c === "string" ? c : undefined} />
}
