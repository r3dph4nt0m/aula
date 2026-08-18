import { currentUser, houses, houseMembers, houseTimeline, rankedHouses } from "@/lib/data"
import { HouseCrest } from "@/components/house-crest"
import { CountUp } from "@/components/count-up"
import { SectionHeading, Meter, Stat, Chip, Divider } from "@/components/ui-bits"
import { Icon } from "@/components/icon"
import { Trophy, TrendingUp, Users, Award } from "lucide-react"

export default function HousePage() {
  const house = houses[currentUser.house]
  const ranked = rankedHouses()
  const position = ranked.findIndex((h) => h.id === house.id) + 1
  const ordinal = ["", "1st", "2nd", "3rd", "4th"][position]
  const above = ranked[position - 2]
  const below = ranked[position]
  const gapText = above
    ? `${above.points - house.points} pts behind ${above.name}`
    : below
      ? `Leading by ${house.points - below.points} pts`
      : "Sole house"
  const growth = house.points - house.lastPeriodPoints

  return (
    <div className={`${house.className} mx-auto max-w-7xl`}>
      {/* Immersive header */}
      <section className="animate-rise relative overflow-hidden rounded-2xl border border-house/25">
        <div className="absolute inset-0 bg-house/[0.08]" />
        <div className="grain absolute inset-0 opacity-60" />
        <div className="absolute -right-16 -top-20 hidden opacity-[0.06] sm:block">
          <Icon name={house.emblem} width={340} height={340} strokeWidth={0.8} className="text-house" />
        </div>
        <div className="relative flex flex-col gap-8 p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-5">
            <HouseCrest house={house} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <Chip tone="house">{house.element}</Chip>
                <Chip tone="house">{house.colorName}</Chip>
              </div>
              <h1 className="mt-2 font-serif text-5xl leading-none tracking-tight text-foreground sm:text-6xl">
                {house.name}
              </h1>
              <p className="mt-2 font-serif text-lg italic text-house-ink">
                &ldquo;{house.motto}&rdquo;
              </p>
            </div>
          </div>

          <div className="grid gap-6 border-t border-house/20 pt-6 sm:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Points</p>
              <p className="font-serif text-4xl tabular text-house-ink">
                <CountUp value={house.points} />
              </p>
            </div>
            <Stat label="Cup position">{ordinal}</Stat>
            <Stat label="Members">{house.members}</Stat>
            <Stat label="Trophies">{house.trophies}</Stat>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-10">
          {/* Standing vs rivals */}
          <section>
            <SectionHeading eyebrow="Season standing" title="Race to the Cup" />
            <div className="mt-5 rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{gapText}</span>
                <span className="flex items-center gap-1 font-medium text-[color:var(--success)]">
                  <TrendingUp width={15} height={15} /> +{growth} this period
                </span>
              </div>
              <div className="mt-5 flex flex-col gap-4">
                {ranked.map((h, i) => {
                  const max = ranked[0].points
                  const isMine = h.id === house.id
                  return (
                    <div key={h.id} className={h.className}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="w-4 tabular text-muted-foreground">{i + 1}</span>
                          <span className={isMine ? "font-semibold text-house-ink" : "text-foreground"}>
                            {h.name}
                          </span>
                          {isMine && <Chip tone="house">You</Chip>}
                        </span>
                        <span className="tabular text-muted-foreground">{h.points.toLocaleString()}</span>
                      </div>
                      <Meter value={h.points} max={max} color="var(--house)" height={isMine ? 10 : 6} />
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* History timeline */}
          <section>
            <SectionHeading eyebrow="Legacy" title="House history" />
            <ol className="mt-5">
              {houseTimeline.map((t) => (
                <li key={t.term} className="flex gap-5 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="grid size-11 place-items-center rounded-full border border-house/30 bg-house/10 font-serif text-sm text-house-ink">
                      {t.term.slice(-2)}
                    </span>
                    <span className="mt-1 w-px flex-1 bg-border last:hidden" />
                  </div>
                  <div className="pb-2 pt-1.5">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t.term}</p>
                    <h3 className="font-serif text-lg leading-tight">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-10">
          <section>
            <SectionHeading
              eyebrow="Top contributors"
              title="House roll"
              action={<Users width={18} height={18} className="text-muted-foreground" />}
            />
            <ol className="mt-5 flex flex-col">
              {houseMembers.map((m, i) => (
                <li
                  key={m.name}
                  className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
                >
                  <span className="w-4 tabular text-sm text-muted-foreground">{i + 1}</span>
                  <span className="grid size-9 place-items-center rounded-lg bg-house/12 text-xs font-medium text-house-ink">
                    {m.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                  <span className="tabular text-sm font-medium text-house-ink">
                    {m.points.toLocaleString()}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2">
              <Award width={18} height={18} className="text-house" />
              <h3 className="font-serif text-lg">Recent achievement</h3>
            </div>
            <Divider className="my-4" />
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-house/12 text-house">
                <Trophy width={18} height={18} />
              </span>
              <div>
                <p className="text-sm font-medium">Ecology Cup — Term 2</p>
                <p className="text-sm text-muted-foreground">
                  Highest SmartBin diversion of any house, earning +400 bonus points.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
