import type { Metadata, Viewport } from "next"

import { ThemeProvider } from "@/components/shared/theme-provider"
import { SITE } from "@/lib/site"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE.name} — Photo, Video & Voice Post-Production Studio`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "DADO is a post-production studio for e-commerce brands, photographers and agencies. Clipping, retouching, colour, video editing and voice over — 24-hour turnaround from $0.30 per image.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // next-themes adds the theme class on <html> before hydration; this silences that one expected diff.
    // data-scroll-behavior: Next turns smooth scrolling off during page changes, so a new page
    // starts at the top instead of sliding up (Next 16 no longer does this by default).
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
