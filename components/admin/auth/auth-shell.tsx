import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"

/* Split screen for sign-in and password reset. The ink panel carries only the
   brand — no business figures, because nobody here is signed in yet. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      <aside className="hidden flex-col justify-between gap-10 bg-panel p-12 text-panel-foreground md:flex">
        <Logo />
        <p className="max-w-[18ch] font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.2]">
          Every trial, client and invoice in <em className="text-clay">one place</em>.
        </p>
        <p className="text-[0.72rem] tracking-[0.14em] text-panel-muted uppercase">Admin workspace</p>
      </aside>

      <main className="grid place-items-center bg-card px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          {children}
          <p className="mt-7 text-center text-[0.8rem] text-muted-foreground">
            <Link href="/" className="border-b border-input hover:text-foreground">
              ← Back to the public site
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

/* Title + intro used by every view in the auth screens. */
export function AuthHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mt-5 mb-7">
      <h1 className="mb-2 font-serif text-[2rem] leading-tight font-normal tracking-[-0.02em]">{title}</h1>
      {children && <div className="text-muted-foreground">{children}</div>}
    </div>
  )
}
