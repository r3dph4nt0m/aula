import { currentUser, houses, badges } from "@/lib/data"
import { HouseCrest } from "@/components/house-crest"
import { XpRing } from "@/components/xp-ring"
import { CountUp } from "@/components/count-up"
import { Icon } from "@/components/icon"
import { SectionHeading } from "@/components/ui-bits"

const tierRing: Record<string, string> = {
  gold: "border-[var(--gold)]/60 bg-[var(--gold)]/10",
  silver: "border-muted-foreground/40 bg-muted",
  bronze: "border-[var(--bronze)]/50 bg-[var(--bronze)]/10",
}

export default function ProfilePage() {
  const house = houses[currentUser.house]
  const unlocked = badges.filter((b) => b.unlocked)
  const locked = badges.filter((b) => !b.unlocked)

  const stats = [
    { label: "Total XP", value: currentUser.xp, sub: "all-time" },
    { label: "House points given", value: currentUser.housePointsContributed, sub: "this year" },
    { label: "Day streak", value: currentUser.streak, sub: "current" },
    { label: "Badges", value: unlocked.length, sub: `of ${badges.length}` },
  ]

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      {/* Header card */}
      <section className={`${house.className} animate-rise relative overflow-hidden rounded-2xl border border-border bg-surface`}>
        <div className="grain pointer-events-none absolute inset-0 opacity-60" />
        <div className="absolute inset-x-0 top-0 h-28 bg-house/10" />
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:p-8">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-house/30 bg-house/[0.08] font-serif text-3xl text-house-ink">
            {currentUser.avatarInitials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <HouseCrest house={house} size="sm" />
              <span className="text-xs uppercase tracking-[0.14em] text-house-ink/80">
                {house.name} · {currentUser.year}
              </span>
            </div>
            <h1 className="mt-2 font-serif text-4xl tracking-tight">{currentUser.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentUser.grade} · {currentUser.handle}
            </p>
          </div>
          <div className="flex items-center gap-5 sm:flex-col sm:items-end">
            <XpRing
              value={currentUser.xpIntoLevel}
              max={currentUser.xpForLevel}
              size={92}
              label={`L${currentUser.level}`}
              sublabel={currentUser.levelTitle}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-serif text-3xl tabular">
              <CountUp value={s.value} />
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </section>

      {/* Badges */}
      <section className="mt-10">
        <SectionHeading eyebrow="Achievements" title="Badge collection" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {unlocked.map((b) => (
            <div
              key={b.id}
              className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center transition-transform hover:-translate-y-0.5"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-full border ${tierRing[b.tier]}`}>
                <Icon name={b.icon} width={26} height={26} className="text-foreground" />
              </div>
              <div>
                <p className="font-medium leading-tight">{b.name}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{b.description}</p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{b.date}</span>
            </div>
          ))}
          {locked.map((b) => (
            <div
              key={b.id}
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center opacity-70"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted">
                <Icon name="lock" width={22} height={22} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium leading-tight text-muted-foreground">{b.name}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{b.description}</p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Locked</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
