import { events } from "@/lib/data"
import { MapPin, Clock, Users } from "lucide-react"

const statusStyle: Record<string, { label: string; cls: string }> = {
  open: { label: "Open", cls: "bg-accent/10 text-accent" },
  "almost-full": { label: "Almost full", cls: "bg-[var(--gold)]/15 text-[var(--bronze)]" },
  registered: { label: "Registered", cls: "bg-foreground text-background" },
  waitlist: { label: "Waitlist", cls: "bg-muted text-muted-foreground" },
}

export default function EventsPage() {
  const [feature, ...rest] = events

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <header className="animate-rise mb-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">What&apos;s on</p>
        <h1 className="mt-1 font-serif text-4xl tracking-tight sm:text-5xl">Campus events</h1>
      </header>

      {/* Featured */}
      <section className="animate-rise relative overflow-hidden rounded-2xl border border-border bg-foreground text-background">
        <div className="grain pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-2xl border border-background/20 bg-background/5">
            <span className="font-serif text-5xl leading-none">{feature.day}</span>
            <span className="mt-1 text-xs uppercase tracking-[0.2em] text-background/70">{feature.month}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.16em] text-background/60">{feature.category} · Featured</span>
            <h2 className="mt-2 text-balance font-serif text-3xl leading-tight">{feature.title}</h2>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-background/80">
              <span className="flex items-center gap-1.5"><Clock width={15} height={15} />{feature.time}</span>
              <span className="flex items-center gap-1.5"><MapPin width={15} height={15} />{feature.location}</span>
              <span className="flex items-center gap-1.5"><Users width={15} height={15} />{feature.registered}/{feature.capacity}</span>
            </div>
            <button className="mt-6 rounded-full bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90">
              You&apos;re registered
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((e) => {
          const status = statusStyle[e.status]
          const pct = Math.round((e.registered / e.capacity) * 100)
          return (
            <article key={e.id} className="flex flex-col rounded-2xl border border-border bg-surface p-5 transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-center rounded-xl border border-border bg-secondary px-3 py-2">
                  <span className="font-serif text-2xl leading-none">{e.day}</span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{e.month}</span>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${status.cls}`}>{status.label}</span>
              </div>
              <h3 className="mt-4 text-balance font-serif text-xl leading-tight">{e.title}</h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{e.category} · {e.organizer}</p>
              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock width={14} height={14} />{e.time}</span>
                <span className="flex items-center gap-1.5"><MapPin width={14} height={14} />{e.location}</span>
              </div>
              <div className="mt-auto pt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{e.registered} of {e.capacity} registered</p>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
