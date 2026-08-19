import { readingData, houses } from "@/lib/data"
import { CountUp } from "@/components/count-up"
import { HouseCrest } from "@/components/house-crest"
import { SectionHeading } from "@/components/ui-bits"
import { BookOpen, Clock, Flame, Library } from "lucide-react"

export default function ReadingPage() {
  const { currentBook, stats, shelf, schoolRanking } = readingData
  const pct = Math.round((currentBook.pagesRead / currentBook.totalPages) * 100)

  const statCards = [
    { label: "Books this year", value: stats.booksThisYear, icon: BookOpen },
    { label: "Pages this year", value: stats.pagesThisYear, icon: Library },
    { label: "Minutes this month", value: stats.minutesThisMonth, icon: Clock },
    { label: "Reading streak", value: stats.streakDays, icon: Flame, suffix: " days" },
  ]

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <header className="animate-rise mb-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Reading Club</p>
        <h1 className="mt-1 font-serif text-4xl tracking-tight sm:text-5xl">Your reading life</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Currently reading */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Currently reading</p>
          <div className="mt-4 flex gap-5">
            <div className="flex h-40 w-28 shrink-0 flex-col justify-end rounded-lg border border-border bg-gradient-to-br from-secondary to-muted p-3 shadow-sm">
              <span className="font-serif text-sm leading-tight text-foreground">{currentBook.title}</span>
            </div>
            <div className="flex flex-1 flex-col">
              <h2 className="text-balance font-serif text-2xl leading-tight">{currentBook.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{currentBook.author}</p>
              <p className="mt-1 text-xs text-muted-foreground">Started {currentBook.startedAt}</p>
              <div className="mt-auto pt-4">
                <div className="flex items-end justify-between">
                  <span className="font-serif text-2xl tabular">{pct}%</span>
                  <span className="text-sm text-muted-foreground">
                    {currentBook.pagesRead} / {currentBook.totalPages} pages
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5">
              <s.icon width={20} height={20} className="text-accent" />
              <div className="mt-4">
                <p className="font-serif text-3xl tabular">
                  <CountUp value={s.value} suffix={s.suffix ?? ""} />
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Shelf */}
      <section className="mt-10">
        <SectionHeading eyebrow="This year" title="Finished shelf" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {shelf.map((b) => (
            <div key={b.title} className="flex flex-col justify-end rounded-xl border border-border bg-gradient-to-br from-secondary to-muted p-4 h-44">
              <p className="font-serif text-base leading-tight">{b.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{b.author}</p>
              <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">{b.pages} pages</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ranking */}
      <section className="mt-10">
        <SectionHeading eyebrow="Leaderboard" title="Top readers this year" />
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {schoolRanking.map((r, i) => {
            const house = houses[r.house]
            return (
              <div
                key={r.name}
                className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0"
              >
                <span className="w-6 font-serif text-lg text-muted-foreground tabular">{i + 1}</span>
                <HouseCrest house={house} size="sm" />
                <div className="flex-1">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{house.name}</p>
                </div>
                <span className="font-serif text-lg tabular">{r.pages.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">pages</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
