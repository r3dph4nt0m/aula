import { smartbinData, houses } from "@/lib/data"
import { SmartBinScanner } from "@/components/smartbin-scanner"
import { HouseCrest } from "@/components/house-crest"
import { CountUp } from "@/components/count-up"
import { SectionHeader } from "@/components/ui-bits"
import { Recycle, Package, Coins, Sprout } from "lucide-react"

export default function SmartBinPage() {
  const { personal, houseRanking, school } = smartbinData
  const maxKg = Math.max(...houseRanking.map((h) => h.kg))

  const personalStats = [
    { label: "Deposits", value: personal.deposits, icon: Recycle },
    { label: "Items sorted", value: personal.itemsSorted, icon: Package },
    { label: "Trash Coins", value: personal.trashCoins, icon: Coins },
    { label: "kg CO₂ saved", value: personal.co2Saved, icon: Sprout },
  ]

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <header className="animate-rise mb-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Ecology Programme</p>
        <h1 className="mt-1 font-serif text-4xl tracking-tight sm:text-5xl">SmartBin</h1>
        <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
          Tap your student card at any NFC-enabled bin. Every sorted item earns Trash Coins and
          feeds your house&apos;s standing in real time.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <SmartBinScanner />

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {personalStats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-surface p-5">
                <s.icon width={20} height={20} className="text-[var(--trash)]" />
                <p className="mt-3 font-serif text-3xl tabular">
                  <CountUp value={s.value} />
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">School total this term</p>
              <span className="text-xs text-[var(--trash)]">{school.participation}% participating</span>
            </div>
            <p className="mt-2 font-serif text-4xl tabular">
              <CountUp value={school.totalKg} suffix=" kg" />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {school.itemsSorted.toLocaleString()} items sorted · {school.activeBins} active bins
            </p>
          </div>
        </div>
      </div>

      {/* House recycling race */}
      <section className="mt-10">
        <SectionHeader eyebrow="Live standings" title="House recycling race" />
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          {houseRanking.map((row) => {
            const house = houses[row.house]
            return (
              <div key={row.house} className={`${house.className} flex items-center gap-4`}>
                <HouseCrest house={house} size="sm" />
                <div className="w-24 shrink-0 font-medium">{house.name}</div>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-house transition-all"
                    style={{ width: `${(row.kg / maxKg) * 100}%` }}
                  />
                </div>
                <div className="w-16 text-right font-serif text-lg tabular">{row.kg} kg</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
