type Feature = { title: string; body: string }

/* Two-column list of numbered features ("Why teams move to us", "Who briefs us"). */
export function FeatureGrid({ items }: { items: Feature[] }) {
  return (
    <div className="grid gap-[clamp(28px,4vw,52px)] min-[761px]:grid-cols-2">
      {items.map((feature, i) => (
        <div key={feature.title} className="reveal grid grid-cols-[auto_1fr] items-start gap-[18px]">
          <span
            aria-hidden
            className="grid size-[38px] place-items-center rounded-[2px] border border-input font-serif text-[0.9rem] text-clay"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="subheading mb-[7px]">{feature.title}</h3>
            <p className="text-[0.93rem] text-foreground/70">{feature.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
