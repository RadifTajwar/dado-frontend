"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/* next-themes sets the .dark class before the page paints, so there is no
   light-to-dark flash on load. */
export function ThemeProvider(props: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />
}
