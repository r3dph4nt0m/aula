import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"
import type { House } from "@/lib/data"

const sizeMap = {
  sm: { box: "size-9", icon: 16, radius: "rounded-md" },
  md: { box: "size-14", icon: 24, radius: "rounded-lg" },
  lg: { box: "size-24", icon: 44, radius: "rounded-xl" },
  xl: { box: "size-36", icon: 68, radius: "rounded-2xl" },
}

export function HouseCrest({
  house,
  size = "md",
  className,
}: {
  house: House
  size?: keyof typeof sizeMap
  className?: string
}) {
  const s = sizeMap[size]
  return (
    <div
      className={cn(house.className, "relative", className)}
      aria-label={`${house.name} crest`}
    >
      <div
        className={cn(
          "grid place-items-center border border-house/25 bg-house/10 text-house",
          s.box,
          s.radius,
        )}
      >
        <Icon name={house.emblem} width={s.icon} height={s.icon} strokeWidth={1.5} />
      </div>
    </div>
  )
}
