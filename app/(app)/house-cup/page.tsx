import { houses, rankedHouses, currentUser } from "@/lib/data"
import { HouseCrest } from "@/components/house-crest"
import { CountUp } from "@/components/count-up"
import { SectionHeading, Meter, Chip } from "@/components/ui-bits"
import { ArrowUp, ArrowDown, Minus, Trophy } from "lucide-react"

// Historical points per house (last 6 checkpoints)
const history: Record<string, number[]> = {
  ravenclaw: [3100, 3480, 3900, 4260, 4610, 5040],
  gryffindor: [3260, 3510, 3820, 4310, 4550, 4820],
  slytherin: [3400, 3720, 4050, 4590, 4620, 4655],
  hufflepuff: [2900, 3200, 3560, 3980, 4180, 4390],
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 120
  const h = 34
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pts = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((d - min) / (max - min || 1)) * h
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={w}
        cy={h - ((data[data.length - 1] - min) / (max - min || 1)) * h}
        r={2.6}
        fill={color}
      />
    </svg>
  )
}

function prevRank(id: string) {
  const prev = Object.values(houses)
    .slice()
    .sort((a, b) => b.lastPeriodPoints - a.lastPeriodPoints)
  return prev.findIndex((h) => h.id === id) + 1
}

export default function HouseCupPage() {
  const ranked = rankedHouses()
  const leader = ranked[0]
  const podium = [ranked[1], ranked[0], ranked[2]] // 2nd, 1st, 3rd for visual podium

  return (
    <div className="mx-auto max-w-6xl">
      <div className="animate-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Season 2026 — 2027 · Term 2
          </p>
          <h1 className="mt-1 font-serif text-4xl tracking-tight sm:text-5xl">The House Cup</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm text-brand">
          <Trophy width={16} height={16} />
          <span className="font-medium">{leader.name} leads</span>
        </div>
      </div>

      {/* Podium */}
      <section className="mt-8 grid grid-cols-3 items-end gap-3 sm:gap-5">
        {podium.map((h, idx) => {
          const place = h.id === leader.id ? 1 : idx === 0 ? 2 : 3
          const heights = { 1: "h-44 sm:h-52", 2: "h-36 sm:h-44", 3: "h-32 sm:h-40" }
          return (
            <div key={h.id} className={`${h.className} flex flex-col items-center`}>
              <HouseCrest house={h} size={place === 1 ? "lg" : "md"} className="animate-scale-in" />
              <p className="mt-3 text-center font-serif text-lg leading-tight">{h.name}</p>
              <p className="tabular text-sm text-house-ink">{h.points.toLocaleString()}</p>
              <div
                className={`mt-3 flex w-full items-start justify-center rounded-t-xl border border-b-0 border-house/25 bg-house/[0.08] pt-3 ${heights[place as 1 | 2 | 3]}`}
              >
                <span className="font-serif text-3xl text-house-ink">{place}</span>
              </div>
            </div>
          )
        })}
      </section>

      {/* Full table */}
      <section className="mt-10">
        <SectionHeading eyebrow="Standings" title="Full leaderboard" />
        <div className="mt-5 overflow-hidden rounded-xl border border-border bg-surface">
          {ranked.map((h, i) => {
            const movement = prevRank(h.id) - (i + 1)
            const next = ranked[i - 1]
            const behind = next ? next.points - h.points : 0
            const isMine = h.id === currentUser.house
            return (
              <div
                key={h.id}
                className={`${h.className} flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0 sm:px-6 ${isMine ? "bg-house/[0.05]" : ""}`}
              >
                <span className="w-6 font-serif text-2xl tabular text-house-ink">{i + 1}</span>
                <HouseCrest house={h} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-serif text-lg leading-tight">{h.name}</p>
                    {isMine && <Chip tone="house">Your house</Chip>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {behind > 0 ? `${behind} pts to ${next.name}` : "Leading the school"}
                  </p>
                  <Meter value={h.points} max={ranked[0].points} color="var(--house)" height={5} className="mt-2 max-w-xs" />
                </div>
                <div className="hidden sm:block">
                  <Sparkline data={history[h.id]} color="var(--house)" />
                </div>
                <div className="w-24 text-right">
                  <p className="tabular font-serif text-xl text-foreground">
                    <CountUp value={h.points} />
                  </p>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-medium ${movement > 0 ? "text-[color:var(--success)]" : movement < 0 ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {movement > 0 ? (
                      <ArrowUp width={12} height={12} />
                    ) : movement < 0 ? (
                      <ArrowDown width={12} height={12} />
                    ) : (
                      <Minus width={12} height={12} />
                    )}
                    {movement !== 0 ? Math.abs(movement) : "—"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Movement shows rank change since the last checkpoint. Points update live from academics,
          ecology, reading and events.
        </p>
      </section>
    </div>
  )
}
