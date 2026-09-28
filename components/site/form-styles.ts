import { cn } from "@/lib/utils"

/* The public forms' input look (DADO style: tall, square, clay focus ring).
   Labels, hints and errors come from components/shared/form-field.tsx. */
export const CONTROL =
  "h-12 rounded-[2px] bg-background px-4 text-[0.95rem] shadow-none focus-visible:border-clay focus-visible:ring-clay/15 md:text-[0.95rem] dark:bg-transparent"
export const TEXTAREA = cn(CONTROL, "h-auto min-h-[132px] resize-y py-3")
// NativeSelect puts className on its wrapper, so style the inner <select> from there.
export const SELECT =
  "w-full [&_select]:h-12 [&_select]:rounded-[2px] [&_select]:bg-background [&_select]:pl-4 [&_select]:text-[0.95rem] [&_select]:shadow-none [&_select]:focus-visible:border-clay [&_select]:focus-visible:ring-clay/15 dark:[&_select]:bg-transparent"
