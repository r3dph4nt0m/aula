import { currentUser, houses, rankedHouses } from "@/lib/data"
import { XpRing } from "@/components/xp-ring"
import { HouseCrest } from "@/components/house-crest"
import { CountUp } from "@/components/count-up"
import { ArrowUpRight, Flame } from "lucide-react"
import Link from "next/link"

export function Greeting() {
  const house = houses[currentUser.house]
  const ranked = rankedHouses()
  const position = ranked.findIndex((h) => h.id === house.id) + 1
  const leader = ranked[0]
  const gap = leader.points - house.points
  const ordinal = ["", "1st", "2nd", "3rd", "4th"][position]

  return (
    <section className="animate-rise grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Greeting + house banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="grain pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative flex flex-col gap-6 p-6 sm:p-8">
          <div>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="mt-1 text-balance font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              Good afternoon,
              <br />
              {currentUser.firstName}.
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Flame width={15} height={15} style={{ color: "var(--house)" }} />
              You&apos;re on a{" "}
              <span className="font-medium text-foreground">{currentUser.streak}-day streak</span>
              {" · "}keep it alive today.
            </p>
          </div>

          <Link
            href="/house-cup"
            className={`${house.className} group mt-auto flex items-center gap-4 rounded-xl border border-house/20 bg-house/[0.07] p-4 transition-colors hover:bg-house/[0.11]`}
          >
            <HouseCrest house={house} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.14em] text-house-ink/70">
                House Cup standing
              </p>
              <p className="font-serif text-xl text-foreground">
                {house.name} · {ordinal} place
              </p>
              <p className="text-sm text-muted-foreground">
                {gap === 0 ? "Leading the school" : `${gap} points from the lead`}
              </p>
            </div>
            <ArrowUpRight
              width={20}
              height={20}
              className="text-house transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Level card */}
      <div className={`${house.className} flex flex-col justify-between gap-6 rounded-2xl border border-border bg-surface p-6 sm:p-8`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Level</p>
            <p className="font-serif text-5xl leading-none">{currentUser.level}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{currentUser.levelTitle}</p>
          </div>
          <XpRing
            value={currentUser.xpIntoLevel}
            max={currentUser.xpForLevel}
            size={104}
            label={`${Math.round((currentUser.xpIntoLevel / currentUser.xpForLevel) * 100)}%`}
            sublabel="to L25"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Total XP</p>
            <p className="font-serif text-2xl tabular">
              <CountUp value={currentUser.xp} />
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">House rank</p>
            <p className="font-serif text-2xl tabular">#{currentUser.rankInHouse}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
