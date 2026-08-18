import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-2xl leading-tight tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

export function Meter({
  value,
  max = 100,
  color = "var(--house)",
  track = "var(--border)",
  className,
  height = 8,
}: {
  value: number
  max?: number
  color?: string
  track?: string
  className?: string
  height?: number
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full", className)}
      style={{ height, backgroundColor: `color-mix(in oklch, ${track} 60%, transparent)` }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-1000 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

export function Stat({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <span className="font-serif text-3xl leading-none tabular text-foreground">{children}</span>
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />
}

export function Chip({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode
  className?: string
  tone?: "neutral" | "house" | "brand"
}) {
  const tones = {
    neutral: "border-border bg-surface text-muted-foreground",
    house: "border-house/25 bg-house/10 text-house-ink",
    brand: "border-brand/30 bg-brand/10 text-brand",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
