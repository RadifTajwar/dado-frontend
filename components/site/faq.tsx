/* Questions and answers on native <details>: opens and closes with zero JavaScript. */
export function Faq({ items }: { items: { question: string; answer: React.ReactNode }[] }) {
  return (
    <div className="reveal border-t">
      {items.map((item) => (
        <details key={item.question} className="group border-b">
          <summary className="relative cursor-pointer list-none py-[22px] pr-11 font-semibold transition-colors after:absolute after:top-1/2 after:right-1.5 after:size-[11px] after:-translate-y-[70%] after:rotate-45 after:border-r-[1.5px] after:border-b-[1.5px] after:border-clay after:transition-[translate,rotate] after:duration-250 group-open:after:-translate-y-[30%] group-open:after:-rotate-[135deg] hover:text-clay [&::-webkit-details-marker]:hidden">
            {item.question}
          </summary>
          <div className="max-w-[80ch] pr-11 pb-6 text-[0.95rem] text-foreground/70">{item.answer}</div>
        </details>
      ))}
    </div>
  )
}
