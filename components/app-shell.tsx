"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from "@/components/icon"
import { AulaMark } from "@/components/aula-mark"
import { currentUser, houses, navItems, serviceNav } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Bell, Search, Menu, X, Sparkles, Coins, ChevronRight } from "lucide-react"

function NavLink({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string
  label: string
  icon: string
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-house/12 font-medium text-house-ink"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon
        name={icon}
        width={18}
        height={18}
        strokeWidth={active ? 2.1 : 1.7}
        className={active ? "text-house" : ""}
      />
      <span>{label}</span>
      {active && <span className="ml-auto size-1.5 rounded-full bg-house" />}
    </Link>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const house = houses[currentUser.house]
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5">
          <AulaMark className="size-8 text-foreground" />
          <div className="leading-none">
            <span className="font-serif text-xl tracking-tight">aula</span>
            <span className="ml-1 text-xs text-muted-foreground">SIA</span>
          </div>
        </Link>
      </div>

      <nav className="mt-7 flex-1 overflow-y-auto px-3">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
          School life
        </p>
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname === item.href}
              onClick={onNavigate}
            />
          ))}
        </div>

        <p className="px-3 pb-2 pt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
          Services
        </p>
        <div className="flex flex-col gap-0.5">
          {serviceNav.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname === item.href}
              onClick={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div className="p-3">
        <Link
          href="/profile"
          onClick={onNavigate}
          className={cn(house.className, "flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-border-strong")}
        >
          <div className="grid size-10 place-items-center rounded-lg bg-house/12 font-serif text-sm font-medium text-house-ink">
            {currentUser.avatarInitials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium">{currentUser.firstName}</p>
            <p className="truncate text-xs text-muted-foreground">
              Level {currentUser.level} · {house.name}
            </p>
          </div>
          <ChevronRight width={16} height={16} className="text-muted-foreground" />
        </Link>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const house = houses[currentUser.house]

  return (
    <div className={cn(house.className, "min-h-screen bg-background")}>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/25 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />
          <div className="animate-rise absolute inset-y-0 left-0 w-72 border-r border-border bg-surface">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-5 grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent"
              aria-label="Close menu"
            >
              <X width={18} height={18} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="grid size-9 place-items-center rounded-md border border-border text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu width={18} height={18} />
            </button>

            <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground sm:flex md:w-72">
              <Search width={16} height={16} />
              <span className="text-muted-foreground/70">Search school life…</span>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium tabular sm:flex">
                <Sparkles width={14} height={14} style={{ color: "var(--xp)" }} />
                {currentUser.xp.toLocaleString()}
                <span className="text-muted-foreground">XP</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium tabular">
                <Coins width={14} height={14} style={{ color: "var(--coin)" }} />
                {currentUser.coins}
              </div>
              <button
                className="relative grid size-9 place-items-center rounded-full border border-border bg-surface text-foreground"
                aria-label="Notifications"
              >
                <Bell width={17} height={17} />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-house ring-2 ring-surface" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <MobileTabs />
    </div>
  )
}

function MobileTabs() {
  const pathname = usePathname()
  const tabs = navItems.slice(0, 5)
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur-md lg:hidden">
      <div className="flex items-stretch justify-around">
        {tabs.map((t) => {
          const active = pathname === t.href
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                active ? "text-house" : "text-muted-foreground",
              )}
            >
              <Icon name={t.icon} width={20} height={20} strokeWidth={active ? 2.1 : 1.7} />
              {t.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
