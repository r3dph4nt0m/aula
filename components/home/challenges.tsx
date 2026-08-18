import { challenges } from "@/lib/data"
import { SectionHeading, Meter, Chip } from "@/components/ui-bits"
import { ArrowRight } from "lucide-react"

const categoryToken: Record<string, string> = {
  Ecology: "var(--trash)",
  Reading: "var(--reading)",
  Academic: "var(--xp)",
  Community: "var(--coin)",
}

export function Challenges() {
  return (
    <section>
      <SectionHeading
        eyebrow="This week"
        title="Active challenges"
        action={
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            View all <ArrowRight width={14} height={14} />
          </button>
        }
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {challenges.map((c) => {
          const token = categoryToken[c.category]
          const pct = Math.round((c.progress / c.goal) * 100)
          return (
            <article
              key={c.id}
              className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
            >
              <div className="flex items-center justify-between">
                <Chip>
                  <span
                    className="mr-1.5 size-1.5 rounded-full"
                    style={{ backgroundColor: token }}
                  />
                  {c.category}
                </Chip>
                <span className="text-xs text-muted-foreground">{c.endsIn} left</span>
              </div>
              <h3 className="mt-3 font-serif text-lg leading-tight">{c.title}</h3>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="tabular">
                  {c.progress} / {c.goal} {c.unit}
                </span>
                <span className="font-medium" style={{ color: token }}>
                  {c.reward}
                </span>
              </div>
              <Meter value={pct} color={token} className="mt-2" height={6} />
            </article>
          )
        })}
      </div>
    </section>
  )
}
