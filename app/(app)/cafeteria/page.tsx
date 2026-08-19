import { cafeteriaStudent, houses } from "@/lib/data"
import { HouseCrest } from "@/components/house-crest"
import { SectionHeading } from "@/components/ui-bits"
import { ArrowDownLeft, ArrowUpRight, CreditCard } from "lucide-react"

export default function CafeteriaPage() {
  const s = cafeteriaStudent
  const house = houses[s.house]

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <header className="animate-rise mb-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Dining Services</p>
        <h1 className="mt-1 font-serif text-4xl tracking-tight sm:text-5xl">Cafeteria account</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Payment card */}
        <section className={`${house.className} animate-rise relative flex aspect-[1.6] flex-col justify-between overflow-hidden rounded-2xl border border-house/25 bg-foreground p-6 text-background`}>
          <div className="grain pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-background/60">aula · Meal card</p>
              <p className="mt-1 font-serif text-lg">{s.name}</p>
            </div>
            <CreditCard width={26} height={26} className="text-background/70" />
          </div>
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.14em] text-background/60">Balance</p>
            <p className="font-serif text-4xl tabular">€{s.balance.toFixed(2)}</p>
            <p className="mt-2 font-mono text-xs tracking-widest text-background/60">{s.studentId}</p>
          </div>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Available</p>
            <p className="mt-2 font-serif text-3xl tabular">€{s.balance.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Outstanding debt</p>
            <p className="mt-2 font-serif text-3xl tabular">€{s.debt.toFixed(2)}</p>
          </div>
          <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-border bg-surface p-5">
            <HouseCrest house={house} size="sm" />
            <div className="flex-1">
              <p className="font-medium">Parent top-up portal</p>
              <p className="text-xs text-muted-foreground">Add credit or set a weekly spending limit</p>
            </div>
            <button className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
              Add credit
            </button>
          </div>
        </section>
      </div>

      {/* Transactions */}
      <section className="mt-10">
        <SectionHeading eyebrow="History" title="Recent transactions" />
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {s.transactions.map((t) => {
            const credit = t.amount > 0
            return (
              <div key={t.id} className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${credit ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {credit ? <ArrowDownLeft width={18} height={18} /> : <ArrowUpRight width={18} height={18} />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.time}</p>
                </div>
                <span className={`font-serif text-lg tabular ${credit ? "text-success" : "text-foreground"}`}>
                  {credit ? "+" : "−"}€{Math.abs(t.amount).toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
