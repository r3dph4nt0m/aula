import { news, houses } from "@/lib/data"
import { HouseCrest } from "@/components/house-crest"
import { ArrowUpRight } from "lucide-react"

export default function NewsPage() {
  const [lead, ...rest] = news

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <header className="animate-rise mb-8 flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">The Gazette</p>
          <h1 className="mt-1 font-serif text-4xl tracking-tight sm:text-5xl">School news</h1>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">Edited by the Student Council</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Lead story */}
        <article className={`${lead.accentHouse ? houses[lead.accentHouse].className : ""} animate-rise`}>
          <div className="relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-house/[0.08] p-6">
            <div className="grain pointer-events-none absolute inset-0 opacity-60" />
            {lead.accentHouse && (
              <div className="absolute right-6 top-6">
                <HouseCrest house={houses[lead.accentHouse]} size="md" />
              </div>
            )}
            <span className="relative text-xs uppercase tracking-[0.16em] text-house-ink">{lead.category}</span>
          </div>
          <h2 className="mt-5 text-balance font-serif text-3xl leading-tight sm:text-4xl">{lead.title}</h2>
          <p className="mt-3 text-pretty text-lg leading-relaxed text-muted-foreground">{lead.excerpt}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {lead.author} · {lead.readTime} read · {lead.date}
          </p>
        </article>

        {/* Secondary list */}
        <div className="flex flex-col divide-y divide-border border-t border-border lg:border-t-0 lg:pl-2">
          {rest.map((n) => (
            <article key={n.id} className="group flex cursor-pointer flex-col gap-1.5 py-5 first:pt-0">
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{n.category}</span>
              <h3 className="flex items-start gap-1 text-balance font-serif text-xl leading-tight">
                {n.title}
                <ArrowUpRight
                  width={16}
                  height={16}
                  className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{n.excerpt}</p>
              <p className="mt-1 text-xs text-muted-foreground">{n.author} · {n.readTime} read</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
