import Link from "next/link"
import { events, news } from "@/lib/data"
import { SectionHeading, Chip } from "@/components/ui-bits"
import { Recycle, BookOpen, Vote, Utensils, MapPin, ArrowRight } from "lucide-react"

const quickActions = [
  { label: "Log a deposit", href: "/smartbin", icon: Recycle, token: "var(--trash)" },
  { label: "Track reading", href: "/reading", icon: BookOpen, token: "var(--reading)" },
  { label: "Vote on ideas", href: "/participation", icon: Vote, token: "var(--xp)" },
  { label: "Cafeteria", href: "/cafeteria", icon: Utensils, token: "var(--coin)" },
]

export function HomeAside() {
  const upcoming = events.slice(0, 3)
  const lead = news[0]
  return (
    <div className="flex flex-col gap-8">
      {/* Quick actions */}
      <section>
        <SectionHeading title="Quick actions" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          {quickActions.map((a) => {
            const AIcon = a.icon
            return (
              <Link
                key={a.label}
                href={a.href}
                className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
              >
                <span
                  className="grid size-9 place-items-center rounded-lg"
                  style={{
                    color: a.token,
                    backgroundColor: `color-mix(in oklch, ${a.token} 12%, transparent)`,
                  }}
                >
                  <AIcon width={18} height={18} />
                </span>
                <span className="text-sm font-medium leading-tight">{a.label}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Upcoming events */}
      <section>
        <SectionHeading
          title="Upcoming"
          action={
            <Link
              href="/events"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Events <ArrowRight width={14} height={14} />
            </Link>
          }
        />
        <div className="mt-4 flex flex-col">
          {upcoming.map((e) => (
            <Link
              key={e.id}
              href="/events"
              className="flex items-center gap-4 border-b border-border py-3 last:border-b-0"
            >
              <div className="flex w-12 flex-col items-center rounded-lg border border-border bg-surface py-1.5">
                <span className="font-serif text-lg leading-none">{e.day}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {e.month}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-tight">{e.title}</p>
                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin width={11} height={11} /> {e.location} · {e.time}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* News teaser */}
      <section>
        <SectionHeading
          title="School news"
          action={
            <Link
              href="/news"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Read <ArrowRight width={14} height={14} />
            </Link>
          }
        />
        <Link
          href="/news"
          className="mt-4 block rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
        >
          <Chip tone="brand">{lead.category}</Chip>
          <h3 className="mt-3 text-balance font-serif text-xl leading-tight">{lead.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{lead.excerpt}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {lead.author} · {lead.readTime} read
          </p>
        </Link>
      </section>
    </div>
  )
}
