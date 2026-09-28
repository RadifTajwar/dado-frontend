import type { Metadata } from "next"

import { ContactsView } from "@/components/admin/contacts/contacts-view"
import { API } from "@/lib/api/endpoints"
import { getAdmin } from "@/lib/api/server"
import type { Contact } from "@/lib/types"

export const metadata: Metadata = { title: "Contact messages" }

export default async function ContactsPage() {
  const contacts = await getAdmin<Contact[]>(API.admin.contacts)
  return <ContactsView contacts={contacts} />
}
