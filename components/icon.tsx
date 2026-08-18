import {
  House,
  Shield,
  Trophy,
  BookOpen,
  Calendar,
  Newspaper,
  Vote,
  User,
  Recycle,
  Utensils,
  LayoutDashboard,
  Flame,
  Feather,
  Waves,
  Sprout,
  Leaf,
  Timer,
  Crown,
  Megaphone,
  Lock,
  type LucideProps,
} from "lucide-react"
import type { ComponentType } from "react"

const map: Record<string, ComponentType<LucideProps>> = {
  house: House,
  shield: Shield,
  trophy: Trophy,
  "book-open": BookOpen,
  calendar: Calendar,
  newspaper: Newspaper,
  vote: Vote,
  user: User,
  recycle: Recycle,
  utensils: Utensils,
  "layout-dashboard": LayoutDashboard,
  flame: Flame,
  feather: Feather,
  waves: Waves,
  sprout: Sprout,
  leaf: Leaf,
  timer: Timer,
  crown: Crown,
  megaphone: Megaphone,
  lock: Lock,
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = map[name] ?? House
  return <Cmp {...props} />
}
