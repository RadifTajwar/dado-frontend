import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { template: "%s — DADO Admin", default: "DADO Admin" },
  robots: { index: false, follow: false },
}

/* Wraps every /admin page (sign-in included) only to set the metadata above. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
