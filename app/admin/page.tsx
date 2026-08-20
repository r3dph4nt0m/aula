"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { houses, type HouseId, adminStats } from "@/lib/data"
import { Icon } from "@/components/icon"
import {
  Users,
  TrendingUp,
  Recycle,
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  ChevronDown,
  Plus,
  X,
  Check,
  Sparkles,
  Coins,
  Leaf,
  BookOpen,
  Shield,
  ArrowUpDown,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

// ── Types ──────────────────────────────────

type StudentRow = {
  id: string
  first_name: string
  last_name: string
  username: string | null
  house_slug: string | null
  house_name: string | null
  role: string
  level: number
  xp: number
  coins: number
  trash_coins: number
  reading_points: number
  conduct_points: number
  streak_days: number
  total_points: number
}

type TransactionRow = {
  id: string
  user_name: string
  type: string
  amount: number
  source: string
  description: string | null
  created_at: string
}

type AdminTab = "overview" | "students" | "transactions" | "points"

// ── Helpers ────────────────────────────────

const HOUSE_COLORS: Record<string, string> = {
  ravenclaw:  "oklch(0.44 0.12 250)",
  gryffindor: "oklch(0.5 0.19 24)",
  slytherin:  "oklch(0.46 0.1 158)",
  hufflepuff: "oklch(0.72 0.14 82)",
}

const POINT_TYPE_CONFIG: Record<string, { label: string; icon: typeof Sparkles; color: string }> = {
  trash:    { label: "Trash",    icon: Leaf,     color: "var(--trash)" },
  reading:  { label: "Reading",  icon: BookOpen, color: "var(--reading)" },
  conduct:  { label: "Conduct",  icon: Shield,   color: "var(--brand)" },
  xp_bonus: { label: "XP Bonus", icon: Sparkles, color: "var(--xp)" },
  coin_bonus: { label: "Coin Bonus", icon: Coins, color: "var(--coin)" },
  coin_spend: { label: "Coin Spend", icon: Coins, color: "var(--destructive)" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

// ── Main ───────────────────────────────────

export default function AdminPage() {
  const { profile, loading: authLoading } = useAuth()
  const [tab, setTab] = useState<AdminTab>("overview")

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    )
  }

  if (!profile || profile.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle width={40} height={40} className="mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm font-medium">Access restricted</p>
          <p className="mt-1 text-xs text-muted-foreground">Admin only.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="flex h-14 items-center gap-4 px-6">
          <span className="font-serif text-lg tracking-tight">aula</span>
          <span className="text-xs text-muted-foreground">Admin</span>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <span>{profile.first_name} {profile.last_name}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs font-medium uppercase tracking-wider text-destructive">Admin</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-surface">
        <div className="flex gap-0 px-6">
          {([
            { key: "overview",     label: "Overview" },
            { key: "students",     label: "Students" },
            { key: "transactions", label: "Transactions" },
            { key: "points",       label: "Award Points" },
          ] as { key: AdminTab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                tab === t.key
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {tab === "overview"     && <OverviewTab />}
        {tab === "students"     && <StudentsTab />}
        {tab === "transactions" && <TransactionsTab />}
        {tab === "points"       && <PointsTab />}
      </div>
    </div>
  )
}

// ── Overview Tab ───────────────────────────

function OverviewTab() {
  const [houseData, setHouseData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("house_rankings").select("*").order("total_points", { ascending: false })
      if (data && data.length > 0) {
        setHouseData(data)
      } else {
        // Fallback to mock chart data
        setHouseData(adminStats.weeklyPoints.map((d) => ({
          ...d,
          ravenclaw_total: 5040,
          gryffindor_total: 4820,
          slytherin_total: 4655,
          hufflepuff_total: 4390,
        })))
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const chartData = adminStats.weeklyPoints

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Active students", value: adminStats.activeStudents, icon: Users, color: "var(--foreground)" },
          { label: "Weekly active", value: adminStats.weeklyActive, icon: TrendingUp, color: "var(--success)" },
          { label: "Points this week", value: adminStats.housePointsWeek, icon: Sparkles, color: "var(--xp)" },
          { label: "SmartBin kg/week", value: adminStats.smartbinKgWeek, icon: Recycle, color: "var(--trash)" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <s.icon width={16} height={16} style={{ color: s.color }} />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular">{s.value.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Alerts</h2>
        <div className="space-y-2">
          {adminStats.alerts.map((alert) => {
            const cfg = {
              warning: { icon: AlertTriangle, className: "text-amber-600 bg-amber-50" },
              info:    { icon: Info,         className: "text-blue-600 bg-blue-50" },
              critical:{ icon: AlertCircle,  className: "text-destructive bg-destructive/8" },
            }[alert.level] ?? { icon: Info, className: "text-muted-foreground bg-muted" }
            const AlertIcon = cfg.icon
            return (
              <div key={alert.id} className="flex items-start gap-3 rounded-md border border-border px-3 py-2.5">
                <AlertIcon width={15} height={15} className={cn("mt-0.5 shrink-0", cfg.className.split(" ")[0])} />
                <p className="text-sm leading-snug">{alert.text}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly chart */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Weekly House Points</h2>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barCategoryGap="20%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.375rem",
                  fontSize: "12px",
                  color: "var(--foreground)",
                }}
              />
              <Bar dataKey="ravenclaw"  fill={HOUSE_COLORS.ravenclaw}  radius={[2, 2, 0, 0]} name="Ravenclaw" />
              <Bar dataKey="gryffindor" fill={HOUSE_COLORS.gryffindor} radius={[2, 2, 0, 0]} name="Gryffindor" />
              <Bar dataKey="slytherin"  fill={HOUSE_COLORS.slytherin}  radius={[2, 2, 0, 0]} name="Slytherin" />
              <Bar dataKey="hufflepuff" fill={HOUSE_COLORS.hufflepuff} radius={[2, 2, 0, 0]} name="Hufflepuff" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* House breakdown */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">House Breakdown</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-2 font-medium">House</th>
              <th className="pb-2 font-medium tabular text-right">Members</th>
              <th className="pb-2 font-medium tabular text-right">Trash</th>
              <th className="pb-2 font-medium tabular text-right">Reading</th>
              <th className="pb-2 font-medium tabular text-right">Conduct</th>
              <th className="pb-2 font-medium tabular text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {houseData.length > 0 ? houseData.map((h: any) => (
              <tr key={h.house_id} className="border-b border-border/50 last:border-0">
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ background: h.color }} />
                    <span className="font-medium">{h.name}</span>
                  </div>
                </td>
                <td className="py-2.5 tabular text-right text-muted-foreground">{h.member_count}</td>
                <td className="py-2.5 tabular text-right">{(h.total_trash_coins ?? 0).toLocaleString()}</td>
                <td className="py-2.5 tabular text-right">{(h.total_reading_points ?? 0).toLocaleString()}</td>
                <td className="py-2.5 tabular text-right">{(h.total_conduct_points ?? 0).toLocaleString()}</td>
                <td className="py-2.5 tabular text-right font-semibold">{(h.total_points ?? 0).toLocaleString()}</td>
              </tr>
            )) : Object.values(houses).map((h) => (
              <tr key={h.id} className="border-b border-border/50 last:border-0">
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ background: `var(--house)` }} />
                    <span className="font-medium">{h.name}</span>
                  </div>
                </td>
                <td className="py-2.5 tabular text-right text-muted-foreground">{h.members}</td>
                <td className="py-2.5 tabular text-right">—</td>
                <td className="py-2.5 tabular text-right">—</td>
                <td className="py-2.5 tabular text-right">—</td>
                <td className="py-2.5 tabular text-right font-semibold">{h.points.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Students Tab ───────────────────────────

function StudentsTab() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [houseFilter, setHouseFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [sortKey, setSortKey] = useState<string>("last_name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("profiles")
      .select("*, houses(slug, name)")
      .order("last_name")

    if (data && data.length > 0) {
      const mapped: StudentRow[] = data.map((s: any) => ({
        id: s.id,
        first_name: s.first_name,
        last_name: s.last_name,
        username: s.username,
        house_slug: s.houses?.slug ?? null,
        house_name: s.houses?.name ?? null,
        role: s.role,
        level: s.level,
        xp: s.xp,
        coins: s.coins,
        trash_coins: s.trash_coins,
        reading_points: s.reading_points,
        conduct_points: s.conduct_points,
        streak_days: s.streak_days,
        total_points: s.trash_coins + s.reading_points + s.conduct_points,
      }))
      setStudents(mapped)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  const filtered = students
    .filter((s) => {
      if (search && !`${s.first_name} ${s.last_name} ${s.username}`.toLowerCase().includes(search.toLowerCase())) return false
      if (houseFilter !== "all" && s.house_slug !== houseFilter) return false
      if (roleFilter !== "all" && s.role !== roleFilter) return false
      return true
    })
    .sort((a, b) => {
      const aVal = (a as any)[sortKey] ?? 0
      const bVal = (b as any)[sortKey] ?? 0
      if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      return sortDir === "asc" ? aVal - bVal : bVal - aVal
    })

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <th
      className="cursor-pointer pb-2 text-left text-xs font-medium text-muted-foreground select-none hover:text-foreground"
      onClick={() => toggleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown width={11} height={11} className={sortKey === field ? "text-foreground" : "opacity-30"} />
      </span>
    </th>
  )

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          <Search width={14} height={14} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 bg-transparent placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <X width={13} height={13} />
            </button>
          )}
        </div>

        <select
          value={houseFilter}
          onChange={(e) => setHouseFilter(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All houses</option>
          {Object.values(houses).map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

        <span className="ml-auto text-xs text-muted-foreground tabular">
          {filtered.length} student{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No students found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border px-4">
                <SortHeader label="Name" field="last_name" />
                <SortHeader label="House" field="house_slug" />
                <SortHeader label="Role" field="role" />
                <SortHeader label="Level" field="level" />
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground">Trash</th>
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground">Reading</th>
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground">Conduct</th>
                <SortHeader label="Total" field="total_points" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-accent/50">
                  <td className="px-4 py-2.5">
                    <div>
                      <p className="font-medium">{s.first_name} {s.last_name}</p>
                      {s.username && <p className="text-[11px] text-muted-foreground">@{s.username}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    {s.house_name ? (
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ background: HOUSE_COLORS[s.house_slug ?? ""] }} />
                        {s.house_name}
                      </span>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
                      s.role === "admin" ? "bg-destructive/10 text-destructive" : s.role === "teacher" ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground",
                    )}>
                      {s.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 tabular">{s.level}</td>
                  <td className="px-4 py-2.5 tabular text-right">{s.trash_coins}</td>
                  <td className="px-4 py-2.5 tabular text-right">{s.reading_points}</td>
                  <td className="px-4 py-2.5 tabular text-right">{s.conduct_points}</td>
                  <td className="px-4 py-2.5 tabular text-right font-semibold">{s.total_points.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Transactions Tab ───────────────────────

function TransactionsTab() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("point_transactions")
      .select("*, profiles(first_name, last_name)")
      .order("created_at", { ascending: false })
      .limit(100)

    if (data) {
      const mapped: TransactionRow[] = data.map((t: any) => ({
        id: t.id,
        user_name: t.profiles ? `${t.profiles.first_name} ${t.profiles.last_name}` : "Unknown",
        type: t.type,
        amount: t.amount,
        source: t.source,
        description: t.description,
        created_at: t.created_at,
      }))
      setTransactions(mapped)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const filtered = typeFilter === "all" ? transactions : transactions.filter((t) => t.type === typeFilter)

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All types</option>
          <option value="trash">Trash Coins</option>
          <option value="reading">Reading Points</option>
          <option value="conduct">Conduct Points</option>
          <option value="xp_bonus">XP Bonus</option>
          <option value="coin_bonus">Coin Bonus</option>
          <option value="coin_spend">Coin Spend</option>
        </select>
        <span className="ml-auto text-xs text-muted-foreground tabular">{filtered.length} transactions</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No transactions found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border px-4">
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Student</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground">Amount</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Source</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const cfg = POINT_TYPE_CONFIG[t.type] ?? POINT_TYPE_CONFIG.xp_bonus
                const TypeIcon = cfg.icon
                return (
                  <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-2.5 font-medium">{t.user_name}</td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-1.5">
                        <TypeIcon width={13} height={13} style={{ color: cfg.color }} />
                        <span className="text-xs">{cfg.label}</span>
                      </span>
                    </td>
                    <td className={cn("px-4 py-2.5 tabular text-right font-medium", t.type === "coin_spend" ? "text-destructive" : "text-success")}>
                      {t.type === "coin_spend" ? "−" : "+"}{t.amount}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.source}</td>
                    <td className="max-w-[200px] truncate px-4 py-2.5 text-xs text-muted-foreground">{t.description ?? "—"}</td>
                    <td className="px-4 py-2.5 tabular text-right text-xs text-muted-foreground">
                      {formatDate(t.created_at)} {formatTime(t.created_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Award Points Tab ───────────────────────

function PointsTab() {
  const { profile } = useAuth()
  const [students, setStudents] = useState<{ id: string; label: string }[]>([])
  const [search, setSearch] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [pointType, setPointType] = useState<"trash" | "reading" | "conduct">("conduct")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .order("last_name")
      .then(({ data }) => {
        if (data) setStudents(data.map((s: any) => ({ id: s.id, label: `${s.first_name} ${s.last_name}` })))
      })
  }, [])

  const filteredStudents = search
    ? students.filter((s) => s.label.toLowerCase().includes(search.toLowerCase()))
    : students

  const handleSubmit = async () => {
    if (!selectedStudent || !amount || !profile) return
    setSubmitting(true)
    setResult(null)

    const amt = parseInt(amount)
    const { error } = await supabase.from("point_transactions").insert({
      user_id: selectedStudent,
      type: pointType,
      amount: amt,
      source: "admin_award",
      description: description || `Admin award: ${pointType} points`,
      created_by: profile.id,
    })

    if (error) {
      setResult({ success: false, message: error.message })
    } else {
      // Update the student's points directly
      const field = { trash: "trash_coins", reading: "reading_points", conduct: "conduct_points" }[pointType]
      if (field) {
        const { data: current } = await supabase.from("profiles").select(field).eq("id", selectedStudent).single()
        if (current) {
          await supabase.from("profiles").update({ [field]: (current as any)[field] + amt }).eq("id", selectedStudent)
        }
      }
      setResult({ success: true, message: `Awarded ${amt} ${pointType} points.` })
      setAmount("")
      setDescription("")
    }
    setSubmitting(false)
    setTimeout(() => setResult(null), 4000)
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="mb-5 text-sm font-medium">Award Points to Student</h2>

        {/* Student search/select */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Student</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name…"
              value={search || (selectedStudent ? students.find((s) => s.id === selectedStudent)?.label ?? "" : "")}
              onChange={(e) => { setSearch(e.target.value); setSelectedStudent("") }}
              onFocus={() => setSearch(search || "")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none"
            />
            {search && !selectedStudent && filteredStudents.length > 0 && (
              <div className="absolute inset-x-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
                {filteredStudents.slice(0, 8).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedStudent(s.id); setSearch(""); }}
                    className="flex w-full px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedStudent && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-success">
              <Check width={12} height={12} />
              {students.find((s) => s.id === selectedStudent)?.label}
              <button onClick={() => setSelectedStudent("")} className="ml-1 text-muted-foreground hover:text-foreground">
                <X width={11} height={11} />
              </button>
            </p>
          )}
        </div>

        {/* Point type */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Point type</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: "trash" as const, label: "Trash Coins", icon: Leaf, color: "var(--trash)" },
              { key: "reading" as const, label: "Reading", icon: BookOpen, color: "var(--reading)" },
              { key: "conduct" as const, label: "Conduct", icon: Shield, color: "var(--brand)" },
            ]).map((t) => {
              const active = pointType === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setPointType(t.key)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors",
                    active ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  <t.icon width={13} height={13} style={active ? {} : { color: t.color }} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Amount</label>
          <input
            type="number"
            min="1"
            max="9999"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 10"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm tabular placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Reason (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Excellent participation in debate"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !selectedStudent || !amount}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
          ) : (
            <Plus width={15} height={15} />
          )}
          {submitting ? "Awarding…" : "Award Points"}
        </button>

        {/* Result */}
        {result && (
          <div
            className={cn(
              "mt-3 rounded-lg border px-3 py-2.5 text-sm",
              result.success
                ? "border-success/30 bg-success/8 text-success"
                : "border-destructive/30 bg-destructive/8 text-destructive",
            )}
          >
            {result.message}
          </div>
        )}
      </div>
    </div>
  )
}