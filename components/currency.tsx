import { cn } from "@/lib/utils"
import { Sparkles, Coins, Recycle, BookOpen, Shield } from "lucide-react"

type Kind = "xp" | "coin" | "trash" | "reading" | "house"

const config: Record<Kind, { label: string; token: string; icon: typeof Coins }> = {
  xp: { label: "XP", token: "var(--xp)", icon: Sparkles },
  coin: { label: "Coins", token: "var(--coin)", icon: Coins },
  trash: { label: "Trash Coins", token: "var(--trash)", icon: Recycle },
  reading: { label: "Reading Coins", token: "var(--reading)", icon: BookOpen },
  house: { label: "House Points", token: "var(--house)", icon: Shield },
}

export function CurrencyPill({
  kind,
  value,
  showLabel = true,
  className,
}: {
  kind: Kind
  value: string | number
  showLabel?: boolean
  className?: string
}) {
  const c = config[kind]
  const CIcon = c.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tabular",
        className,
      )}
      style={{
        color: c.token,
        borderColor: `color-mix(in oklch, ${c.token} 30%, transparent)`,
        backgroundColor: `color-mix(in oklch, ${c.token} 8%, transparent)`,
      }}
    >
      <CIcon width={13} height={13} strokeWidth={2} />
      {value}
      {showLabel && <span className="text-muted-foreground">{c.label}</span>}
    </span>
  )
}

export function CurrencyDot({ kind, className }: { kind: Kind; className?: string }) {
  const c = config[kind]
  const CIcon = c.icon
  return (
    <span
      className={cn("inline-grid size-7 place-items-center rounded-md", className)}
      style={{
        color: c.token,
        backgroundColor: `color-mix(in oklch, ${c.token} 12%, transparent)`,
      }}
    >
      <CIcon width={15} height={15} strokeWidth={2} />
    </span>
  )
}

export { config as currencyConfig }
