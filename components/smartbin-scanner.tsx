"use client"

import { useState } from "react"
import { Nfc, Check } from "lucide-react"

type Phase = "idle" | "scanning" | "sorting" | "done"

const materials = [
  { label: "PET Plastic", coins: 5 },
  { label: "Aluminium", coins: 6 },
  { label: "Paper", coins: 3 },
  { label: "Glass", coins: 4 },
]

export function SmartBinScanner() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [material, setMaterial] = useState(materials[0])
  const [earned, setEarned] = useState(0)

  function tap() {
    if (phase !== "idle" && phase !== "done") return
    const pick = materials[Math.floor(Math.random() * materials.length)]
    setMaterial(pick)
    setPhase("scanning")
    setTimeout(() => setPhase("sorting"), 1100)
    setTimeout(() => {
      setPhase("done")
      setEarned((e) => e + pick.coins)
    }, 2300)
  }

  const ring =
    phase === "scanning"
      ? "animate-ping-slow border-accent"
      : phase === "sorting"
        ? "border-[var(--gold)]"
        : phase === "done"
          ? "border-accent"
          : "border-border"

  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-surface p-8">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Hall C · Bin #07</p>
      <button
        onClick={tap}
        aria-label="Tap your card to deposit"
        className="relative mt-6 flex h-44 w-44 items-center justify-center rounded-full"
      >
        <span className={`absolute inset-0 rounded-full border-2 transition-colors ${ring}`} />
        <span className="absolute inset-4 rounded-full border border-border/60" />
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 text-accent">
          {phase === "done" ? (
            <Check width={40} height={40} className="animate-rise" />
          ) : (
            <Nfc width={40} height={40} className={phase === "scanning" ? "animate-pulse" : ""} />
          )}
        </span>
      </button>

      <div className="mt-6 h-16 text-center">
        {phase === "idle" && (
          <p className="text-sm text-muted-foreground">Tap the reader with your student card to log a deposit</p>
        )}
        {phase === "scanning" && <p className="font-serif text-xl">Reading card…</p>}
        {phase === "sorting" && (
          <p className="font-serif text-xl">Detecting material: {material.label}</p>
        )}
        {phase === "done" && (
          <div className="animate-rise">
            <p className="font-serif text-2xl">{material.label} sorted</p>
            <p className="mt-1 text-sm text-accent">+{material.coins} Trash Coins earned</p>
          </div>
        )}
      </div>

      <button
        onClick={tap}
        disabled={phase === "scanning" || phase === "sorting"}
        className="mt-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {phase === "done" ? "Deposit another" : "Simulate a tap"}
      </button>

      {earned > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          Session total: <span className="font-medium text-foreground">+{earned} Trash Coins</span>
        </p>
      )}
    </div>
  )
}
