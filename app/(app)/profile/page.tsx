"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { currentUser, houses, badges, type HouseId } from "@/lib/data"
import { HouseCrest } from "@/components/house-crest"
import { XpRing } from "@/components/xp-ring"
import { CountUp } from "@/components/count-up"
import { Icon } from "@/components/icon"
import { SectionHeading } from "@/components/ui-bits"
import { cn } from "@/lib/utils"
import { Coins, Lock, Check, ChevronDown, ShoppingBag } from "lucide-react"

type AvatarItem = {
  id: string
  name: string
  slug: string
  category: "background" | "frame" | "accessory"
  rarity: "common" | "rare" | "epic" | "legendary"
  cost_coins: number
  config: Record<string, any>
  owned: boolean
  equipped: boolean
}

type AvatarCategory = "background" | "frame" | "accessory"

const tierRing: Record<string, string> = {
  gold: "border-[var(--gold)]/60 bg-[var(--gold)]/10",
  silver: "border-muted-foreground/40 bg-muted",
  bronze: "border-[var(--bronze)]/50 bg-[var(--bronze)]/10",
}

const RARITY_STYLE: Record<string, { label: string; border: string; text: string }> = {
  common:    { label: "Common",    border: "border-border",         text: "text-muted-foreground" },
  rare:      { label: "Rare",      border: "border-blue-400/50",   text: "text-blue-600" },
  epic:      { label: "Epic",      border: "border-purple-400/50", text: "text-purple-600" },
  legendary: { label: "Legendary", border: "border-amber-400/50",  text: "text-amber-600" },
}

const CATEGORIES: { key: AvatarCategory; label: string }[] = [
  { key: "background",  label: "Backgrounds" },
  { key: "frame",       label: "Frames" },
  { key: "accessory",   label: "Accessories" },
]

export default function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth()
  const [showAvatar, setShowAvatar] = useState(false)
  const [avatarItems, setAvatarItems] = useState<AvatarItem[]>([])
  const [avatarCategory, setAvatarCategory] = useState<AvatarCategory>("background")
  const [buying, setBuying] = useState<string | null>(null)

  // Use real data if available, otherwise fall back to mock
  const p = profile
  const houseSlug = (p?.houses?.slug ?? currentUser.house) as HouseId
  const house = houses[houseSlug]
  const firstName = p?.first_name ?? currentUser.firstName
  const lastName = p?.last_name ?? "Mercier"
  const fullName = p ? `${p.first_name} ${p.last_name}` : currentUser.name
  const initials = `${firstName[0]}${lastName[0]}`
  const grade = p?.class_name ?? currentUser.grade
  const handle = p?.username ? `@${p.username}` : currentUser.handle
  const year = p?.year_group ? `Year ${p.year_group}` : currentUser.year
  const xpIntoLevel = p ? p.xp % 900 : currentUser.xpIntoLevel
  const xpForLevel = 900
  const level = p?.level ?? currentUser.level
  const levelTitle = p ? undefined : currentUser.levelTitle
  const totalXp = p?.xp ?? currentUser.xp
  const housePoints = p ? p.trash_coins + p.reading_points + p.conduct_points : currentUser.housePointsContributed
  const streak = p?.streak_days ?? currentUser.streak
  const coins = p?.coins ?? currentUser.coins
  const isPrefect = p?.is_prefect ?? false

  const avatarConfig = (p?.avatar_config as Record<string, string>) ?? {}

  const equippedBg = avatarItems.find((i) => i.category === "background" && i.equipped)
  const equippedFrame = avatarItems.find((i) => i.category === "frame" && i.equipped)
  const equippedAcc = avatarItems.find((i) => i.category === "accessory" && i.equipped)

  const unlocked = badges.filter((b) => b.unlocked)
  const locked = badges.filter((b) => !b.unlocked)

  const stats = [
    { label: "Total XP", value: totalXp, sub: "all-time" },
    { label: "House points given", value: housePoints, sub: "this year" },
    { label: "Day streak", value: streak, sub: "current" },
    { label: "Badges", value: unlocked.length, sub: `of ${badges.length}` },
  ]

  // Avatar items fetching
  const fetchAvatarItems = useCallback(async () => {
    if (!user) return
    const { data: items } = await supabase.from("avatar_items").select("*").order("cost_coins")
    const { data: owned } = await supabase
      .from("user_avatar_items")
      .select("item_id, equipped")
      .eq("user_id", user.id)

    const ownedMap = new Map((owned ?? []).map((o) => [o.item_id, o.equipped]))

    const mapped: AvatarItem[] = (items ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category,
      rarity: item.rarity,
      cost_coins: item.cost_coins,
      config: item.config as Record<string, any>,
      owned: ownedMap.has(item.id),
      equipped: ownedMap.get(item.id) === true,
    }))

    setAvatarItems(mapped)
  }, [user])

  useEffect(() => { fetchAvatarItems() }, [fetchAvatarItems])

  const equipItem = async (item: AvatarItem) => {
    if (!user) return
    const sameCategory = avatarItems.filter((i) => i.category === item.category && i.equipped && i.id !== item.id)
    for (const i of sameCategory) {
      await supabase.from("user_avatar_items").update({ equipped: false }).eq("item_id", i.id).eq("user_id", user.id)
    }
    await supabase.from("user_avatar_items").update({ equipped: true }).eq("item_id", item.id).eq("user_id", user.id)
    const newConfig = { ...avatarConfig, [item.category]: item.slug }
    await supabase.from("profiles").update({ avatar_config: newConfig }).eq("id", user.id)
    fetchAvatarItems()
    refreshProfile()
  }

  const buyItem = async (item: AvatarItem) => {
    if (!user || !p) return
    if (p.coins < item.cost_coins) return
    setBuying(item.id)
    const newBalance = p.coins - item.cost_coins
    await supabase.from("profiles").update({ coins: newBalance }).eq("id", user.id)
    await supabase.from("user_avatar_items").insert({ user_id: user.id, item_id: item.id, equipped: false })
    await supabase.from("point_transactions").insert({
      user_id: user.id,
      type: "coin_spend",
      amount: item.cost_coins,
      source: "avatar_purchase",
      description: `Purchased avatar item: ${item.name}`,
    })
    await refreshProfile()
    fetchAvatarItems()
    setBuying(null)
  }

  const filteredItems = avatarItems.filter((i) => i.category === avatarCategory)

  const bgColor = equippedBg?.config?.color ?? undefined
  const frameStyle = equippedFrame?.config?.style ?? "none"
  const accIcon = equippedAcc?.config?.icon
  const accColor = equippedAcc?.config?.color

  const frameClass = {
    none: "",
    thin: "ring-2 ring-house",
    double: "ring-[3px] ring-house ring-offset-2 ring-offset-surface",
    dotted: "ring-2 ring-dashed ring-coin/60",
    crest: "ring-2 ring-house ring-offset-4 ring-offset-surface",
    laurel: "ring-[3px] ring-coin ring-offset-2 ring-offset-surface",
  }[frameStyle] ?? ""

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      {/* Header card */}
      <section className={`${house.className} animate-rise relative overflow-hidden rounded-2xl border border-border bg-surface`}>
        <div className="grain pointer-events-none absolute inset-0 opacity-60" />
        <div className="absolute inset-x-0 top-0 h-28 bg-house/10" />
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:p-8">
          {/* Avatar with customize button */}
          <div className="relative shrink-0">
            <div
              className={cn(
                "flex h-24 w-24 items-center justify-center rounded-2xl border border-house/30 font-serif text-3xl text-house-ink transition-all duration-300",
                frameClass,
              )}
              style={{ background: bgColor ?? "rgba(var(--house-rgb, 0,0,0), 0.08)" }}
            >
              {initials}
              {accIcon && (
                <div className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-surface bg-background">
                  <Icon name={accIcon} width={12} height={12} style={{ color: accColor }} />
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAvatar(!showAvatar)}
              className="absolute -bottom-2 -right-2 grid size-7 place-items-center rounded-full border border-border bg-surface text-foreground shadow-sm transition-colors hover:bg-accent"
              aria-label="Customize avatar"
            >
              <Icon name="palette" width={13} height={13} />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <HouseCrest house={house} size="sm" />
              <span className="text-xs uppercase tracking-[0.14em] text-house-ink/80">
                {house.name} · {year}
              </span>
              {isPrefect && (
                <span className="rounded-full border border-coin/30 bg-coin/8 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-coin">
                  Prefect
                </span>
              )}
            </div>
            <h1 className="mt-2 font-serif text-4xl tracking-tight">{fullName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {grade} · {handle}
            </p>
          </div>
          <div className="flex items-center gap-5 sm:flex-col sm:items-end">
            <XpRing
              value={xpIntoLevel}
              max={xpForLevel}
              size={92}
              label={`L${level}`}
              sublabel={levelTitle}
            />
          </div>
        </div>
      </section>

      {/* Avatar customization panel */}
      {showAvatar && (
        <section className="animate-scale-in mt-4 rounded-2xl border border-border bg-surface p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg tracking-tight">Customize Avatar</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <Coins width={12} height={12} className="mr-1 inline" style={{ color: "var(--coin)" }} />
                <span className="tabular font-medium">{coins.toLocaleString()}</span> coins available
              </p>
            </div>
            <button
              onClick={() => setShowAvatar(false)}
              className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent"
              aria-label="Close"
            >
              <ChevronDown width={18} height={18} className="rotate-180" />
            </button>
          </div>

          {/* Preview */}
          <div className="mb-5 flex justify-center">
            <div className="relative">
              <div
                className={cn(
                  "grid size-24 place-items-center rounded-2xl font-serif text-3xl font-medium text-house-ink transition-all duration-300",
                  house.className,
                  frameClass,
                )}
                style={{ background: bgColor ?? "rgba(var(--house-rgb, 0,0,0), 0.08)" }}
              >
                {initials}
              </div>
              {accIcon && (
                <div className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-2 border-surface bg-background">
                  <Icon name={accIcon} width={14} height={14} style={{ color: accColor }} />
                </div>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="mb-4 flex gap-1 rounded-lg border border-border bg-background p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setAvatarCategory(c.key)}
                className={cn(
                  "flex-1 rounded-md px-2 py-2 text-xs font-medium transition-colors",
                  avatarCategory === c.key
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
            {filteredItems.map((item) => {
              const rarity = RARITY_STYLE[item.rarity]
              const isBuying = buying === item.id
              const canAfford = coins >= item.cost_coins

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!item.owned) { buyItem(item); return }
                    if (item.equipped) return
                    equipItem(item)
                  }}
                  disabled={isBuying}
                  className={cn(
                    "group relative flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                    item.equipped
                      ? "border-house/40 bg-house/6"
                      : item.owned
                        ? "border-border bg-background hover:border-border-strong"
                        : `${rarity.border} bg-background hover:bg-accent`,
                  )}
                >
                  <div className="flex size-10 items-center justify-center">
                    {item.category === "background" ? (
                      <div className="size-8 rounded-lg" style={{ background: item.config.color }} />
                    ) : item.category === "frame" ? (
                      <div className={cn("grid size-8 place-items-center rounded-lg bg-muted text-[10px] font-medium", {
                        "ring-2 ring-foreground": item.config.style === "thin",
                        "ring-[3px] ring-foreground ring-offset-1": item.config.style === "double",
                        "ring-2 ring-dashed ring-foreground/50": item.config.style === "dotted",
                        "ring-2 ring-foreground ring-offset-2": item.config.style === "crest",
                        "ring-[3px] ring-foreground ring-offset-1": item.config.style === "laurel",
                      })}>
                        {initials}
                      </div>
                    ) : item.config.type === "icon" ? (
                      <Icon name={item.config.icon} width={20} height={20} style={{ color: item.config.color }} />
                    ) : (
                      <div className="size-8 rounded-lg bg-muted" />
                    )}
                  </div>

                  <span className="text-center text-[11px] font-medium leading-tight">{item.name}</span>
                  <span className={cn("text-[10px]", rarity.text)}>{rarity.label}</span>

                  {item.equipped && (
                    <div className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-house text-[9px] text-house-foreground">
                      <Check width={10} height={10} />
                    </div>
                  )}

                  {!item.owned && (
                    <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-foreground/90 px-1 py-1">
                      <p className="flex items-center justify-center gap-1 text-[10px] font-medium text-background">
                        {isBuying ? "…" : (
                          <><Coins width={8} height={8} />{item.cost_coins}</>
                        )}
                      </p>
                      {!canAfford && !isBuying && (
                        <Lock width={7} height={7} className="absolute right-1.5 top-1.5 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {filteredItems.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Connect to the database to see avatar items.
            </p>
          )}
        </section>
      )}

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