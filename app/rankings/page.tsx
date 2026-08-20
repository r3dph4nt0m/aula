"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Trophy, Leaf, BookOpen, Shield, Star, TrendingUp } from "lucide-react"

type RankingTab = "overall" | "trash" | "reading" | "conduct"

type HouseRanking = {
  house_id: string
  name: string
  slug: string
  motto: string | null
  color: string
  color_ink: string
  color_soft: string
  color_fg: string
  member_count: number
  total_trash_coins: number
  total_reading_points: number
  total_conduct_points: number
  total_points: number
}

type IndividualRank = {
  user_id: string
  first_name: string
  last_name: string
  username: string | null
  house_name: string
  house_slug: string
  value: number
  rank: number
}

type ViewMode = "individual" | "house"

const TABS: { key: RankingTab; label: string; icon: typeof Star; color: string }[] = [
  { key: "overall",  label: "Overall",  icon: Star,      color: "var(--coin)" },
  { key: "trash",    label: "Recycling", icon: Leaf,       color: "var(--trash)" },
  { key: "reading",  label: "Reading",  icon: BookOpen,   color: "var(--reading)" },
  { key: "conduct",  label: "Conduct",  icon: Shield,     color: "var(--brand)" },
]

export default function RankingsPage() {
  const { profile } = useAuth()
  const [tab, setTab] = useState<RankingTab>("overall")
  const [view, setView] = useState<ViewMode>("individual")
  const [houseRankings, setHouseRankings] = useState<HouseRanking[]>([])
  const [individualRankings, setIndividualRankings] = useState<IndividualRank[]>([])
  const [loading, setLoading] = useState(true)

  const getHouseValue = (h: HouseRanking, t: RankingTab) => {
    switch (t) {
      case "overall":  return h.total_points
      case "trash":    return h.total_trash_coins
      case "reading":  return h.total_reading_points
      case "conduct":  return h.total_conduct_points
    }
  }

  const fetchHouseRankings = useCallback(async () => {
    const { data } = await supabase
      .from("house_rankings")
      .select("*")
      .order("total_points", { ascending: false })
    setHouseRankings((data as HouseRanking[]) ?? [])
  }, [])

  const fetchIndividualRankings = useCallback(async () => {
    const viewName = {
      overall: "individual_overall_ranking",
      trash: "individual_trash_ranking",
      reading: "individual_reading_ranking",
      conduct: "individual_conduct_ranking",
    }[tab]

    const valueField = {
      overall: "total_points",
      trash: "trash_coins",
      reading: "reading_points",
      conduct: "conduct_points",
    }[tab] as string

    const { data } = await supabase
      .from(viewName as any)
      .select("*")
      .order(valueField, { ascending: false })
      .limit(50)

    const mapped: IndividualRank[] = (data ?? []).map((r: any) => ({
      user_id: r.user_id,
      first_name: r.first_name,
      last_name: r.last_name,
      username: r.username,
      house_name: r.house_name,
      house_slug: r.house_slug,
      value: r[valueField] ?? 0,
      rank: r.rank,
    }))
    setIndividualRankings(mapped)
  }, [tab])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchHouseRankings(), fetchIndividualRankings()]).finally(() =>
      setLoading(false)
    )
  }, [fetchHouseRankings, fetchIndividualRankings])

  const sortedHouses = [...houseRankings].sort(
    (a, b) => getHouseValue(b, tab) - getHouseValue(a, tab)
  )

  const maxValue =
    view === "house"
      ? Math.max(...sortedHouses.map((h) => getHouseValue(h, tab)), 1)
      : Math.max(...individualRankings.map((r) => r.value), 1)

  const unitLabel = { overall: "pts", trash: "coins", reading: "pts", conduct: "pts" }[tab]
  const tabConfig = TABS.find((t) => t.key === tab)!

  return (
    <div className="mx-auto max-w-2xl animate-rise">
      <div className="mb-8">
        <h1 className="font-serif text-2xl tracking-tight">Rankings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track progress across every category.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-1.5">
        {TABS.map((t) => {
          const active = tab === t.key
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon width={18} height={18} style={active ? {} : { color: t.color }} />
              <span className="text-[11px] font-medium">{t.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-surface p-1">
        {(["individual", "house"] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              view === v
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {v === "individual" ? "Students" : "Houses"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-muted" />
                <div className="flex-1">
                  <div className="mb-1.5 h-4 w-1/3 rounded bg-muted" />
                  <div className="h-2 w-2/5 rounded bg-muted" />
                </div>
                <div className="h-5 w-16 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : view === "house" ? (
        <div className="space-y-2">
          {sortedHouses.map((house, i) => {
            const value = getHouseValue(house, tab)
            const pct = (value / maxValue) * 100
            const isMe = house.slug === profile?.houses?.slug
            return (
              <div
                key={house.house_id}
                className={cn(
                  "animate-rise rounded-lg border bg-surface p-4 transition-colors",
                  isMe ? "border-house/40" : "border-border",
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <span className={cn("w-6 text-center text-sm font-semibold tabular", i === 0 ? "text-coin" : "text-muted-foreground")}>
                    {i + 1}
                  </span>
                  <div className="size-3 rounded-full shrink-0" style={{ background: house.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{house.name}</span>
                      {isMe && <span className="text-[10px] font-medium uppercase tracking-wider text-house">Your house</span>}
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: house.color }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-semibold tabular">{value.toLocaleString()}</span>
                    <span className="text-[11px] text-muted-foreground">{unitLabel}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-1.5">
          {individualRankings.map((rank, i) => {
            const pct = (rank.value / maxValue) * 100
            const isMe = rank.user_id === profile?.id
            return (
              <div
                key={rank.user_id}
                className={cn("animate-rise flex items-center gap-3 rounded-lg px-3 py-3 transition-colors", isMe ? "bg-house/6" : "hover:bg-surface")}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className={cn("w-5 text-center text-xs font-semibold tabular", i === 0 ? "text-coin" : "text-muted-foreground/60")}>
                  {rank.rank}
                </span>
                <div className={cn("grid size-8 shrink-0 place-items-center rounded-md text-xs font-medium", isMe ? "bg-house/12 text-house-ink" : "bg-muted text-muted-foreground")}>
                  {rank.first_name[0]}{rank.last_name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm", isMe ? "font-medium" : "")}>
                    {rank.first_name} {rank.last_name}
                    {isMe && <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wider text-house">You</span>}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{rank.house_name}</p>
                  <div className="mt-1.5 h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-muted/50">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: tabConfig.color, opacity: 0.7 }} />
                  </div>
                </div>
                <span className="tabular text-sm font-semibold">{rank.value.toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}