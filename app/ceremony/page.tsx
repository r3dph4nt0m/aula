"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ceremonyQuestions, houses, type HouseId } from "@/lib/data"
import { HouseCrest } from "@/components/house-crest"
import { AulaMark } from "@/components/aula-mark"
import { Icon } from "@/components/icon"
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react"

type Phase = "intro" | "quiz" | "suspense" | "reveal"

export default function CeremonyPage() {
  const [phase, setPhase] = useState<Phase>("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<HouseId[]>([])

  const result: HouseId = useMemo(() => {
    const tally: Record<string, number> = {}
    answers.forEach((h) => (tally[h] = (tally[h] || 0) + 1))
    let best: HouseId = "ravenclaw"
    let max = -1
    ;(Object.keys(tally) as HouseId[]).forEach((h) => {
      if (tally[h] > max) {
        max = tally[h]
        best = h
      }
    })
    return best
  }, [answers])

  useEffect(() => {
    if (phase !== "suspense") return
    const t = setTimeout(() => setPhase("reveal"), 3200)
    return () => clearTimeout(t)
  }, [phase])

  const choose = (house: HouseId) => {
    const next = [...answers]
    next[step] = house
    setAnswers(next)
    if (step < ceremonyQuestions.length - 1) {
      setTimeout(() => setStep(step + 1), 220)
    } else {
      setTimeout(() => setPhase("suspense"), 260)
    }
  }

  const house = houses[result]

  return (
    <main
      className={phase === "reveal" ? house.className : ""}
      style={{
        minHeight: "100vh",
        background:
          phase === "reveal"
            ? "radial-gradient(120% 120% at 50% 0%, color-mix(in oklch, var(--house) 22%, oklch(0.16 0.02 60)) 0%, oklch(0.14 0.015 60) 60%)"
            : "radial-gradient(120% 120% at 50% -10%, oklch(0.24 0.02 60) 0%, oklch(0.13 0.012 60) 55%)",
        color: "oklch(0.96 0.006 84)",
      }}
    >
      <div className="grain pointer-events-none fixed inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        {phase === "intro" && <Intro onBegin={() => setPhase("quiz")} />}

        {phase === "quiz" && (
          <Quiz
            step={step}
            total={ceremonyQuestions.length}
            selected={answers[step]}
            onChoose={choose}
            onBack={() => step > 0 && setStep(step - 1)}
          />
        )}

        {phase === "suspense" && <Suspense />}

        {phase === "reveal" && <Reveal house={house} />}
      </div>
    </main>
  )
}

function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="animate-rise flex flex-col items-center">
      <AulaMark className="size-12 text-[oklch(0.85_0.09_66)]" />
      <p className="mt-8 text-xs uppercase tracking-[0.3em] text-[oklch(0.75_0.03_84)]">
        The Sorting Ceremony
      </p>
      <h1 className="mt-4 text-balance font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
        Four houses.
        <br />
        One belongs to you.
      </h1>
      <p className="mt-6 max-w-md text-pretty text-[oklch(0.8_0.02_84)]">
        Answer four questions, honestly and without hesitation. The choice you make will place you
        among those who share your nature.
      </p>
      <button
        onClick={onBegin}
        className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[oklch(0.9_0.05_80)] px-7 py-3.5 text-sm font-medium text-[oklch(0.2_0.02_60)] transition-transform hover:scale-[1.02]"
      >
        Begin the ceremony
        <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}

function Quiz({
  step,
  total,
  selected,
  onChoose,
  onBack,
}: {
  step: number
  total: number
  selected?: HouseId
  onChoose: (h: HouseId) => void
  onBack: () => void
}) {
  const q = ceremonyQuestions[step]
  return (
    <div key={step} className="animate-rise flex w-full flex-col items-center">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="h-1 w-8 rounded-full transition-colors"
            style={{
              backgroundColor:
                i <= step ? "oklch(0.85 0.09 66)" : "oklch(0.4 0.02 60)",
            }}
          />
        ))}
      </div>
      <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[oklch(0.7_0.03_84)]">
        Question {step + 1} of {total}
      </p>
      <h2 className="mt-3 text-balance font-serif text-3xl leading-tight sm:text-4xl">{q.prompt}</h2>

      <div className="mt-8 grid w-full gap-3">
        {q.options.map((opt) => {
          const active = selected === opt.house
          return (
            <button
              key={opt.label}
              onClick={() => onChoose(opt.house)}
              className="group flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all"
              style={{
                borderColor: active ? "oklch(0.85 0.09 66)" : "oklch(0.4 0.02 60 / 0.6)",
                backgroundColor: active ? "oklch(0.85 0.09 66 / 0.12)" : "oklch(0.3 0.02 60 / 0.35)",
              }}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg text-[oklch(0.85_0.09_66)]" style={{ backgroundColor: "oklch(0.85 0.09 66 / 0.14)" }}>
                <Sparkles width={16} height={16} />
              </span>
              <span className="text-[15px] text-[oklch(0.94_0.01_84)]">{opt.label}</span>
              <ArrowRight
                width={16}
                height={16}
                className="ml-auto text-[oklch(0.7_0.03_84)] opacity-0 transition-opacity group-hover:opacity-100"
              />
            </button>
          )
        })}
      </div>

      {step > 0 && (
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-[oklch(0.7_0.03_84)] hover:text-[oklch(0.9_0.01_84)]"
        >
          <ArrowLeft width={14} height={14} /> Previous
        </button>
      )}
    </div>
  )
}

function Suspense() {
  return (
    <div className="animate-fade flex flex-col items-center">
      <div className="relative grid size-28 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full" style={{ backgroundColor: "oklch(0.85 0.09 66 / 0.15)" }} />
        <span className="absolute inset-3 rounded-full border" style={{ borderColor: "oklch(0.85 0.09 66 / 0.4)" }} />
        <AulaMark className="size-12 text-[oklch(0.85_0.09_66)]" />
      </div>
      <p className="mt-10 font-serif text-2xl">The hall is deliberating…</p>
      <p className="mt-2 text-sm text-[oklch(0.75_0.02_84)]">Weighing courage, wit, ambition and loyalty.</p>
    </div>
  )
}

function Reveal({ house }: { house: (typeof houses)[HouseId] }) {
  return (
    <div className="animate-scale-in flex flex-col items-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.82_0.03_84)]">You belong to</p>
      <div className="relative mt-6">
        <span className="absolute inset-0 -z-10 rounded-full blur-3xl" style={{ backgroundColor: "color-mix(in oklch, var(--house) 45%, transparent)" }} />
        <span className="grid size-32 place-items-center rounded-2xl border border-[var(--house)]/50 bg-[var(--house)]/20 text-[oklch(0.95_0.02_84)]">
          <Icon name={house.emblem} width={72} height={72} strokeWidth={1.4} />
        </span>
      </div>
      <h1 className="mt-8 font-serif text-6xl leading-none tracking-tight sm:text-7xl">{house.name}</h1>
      <p className="mt-4 font-serif text-xl italic text-[oklch(0.88_0.02_84)]">
        &ldquo;{house.motto}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-2 text-sm text-[oklch(0.82_0.02_84)]">
        <span className="size-3 rounded-full" style={{ backgroundColor: "var(--house)" }} />
        {house.colorName} · {house.element}
      </div>
      <Link
        href="/house"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-[oklch(0.94_0.02_84)] px-7 py-3.5 text-sm font-medium text-[oklch(0.2_0.02_60)] transition-transform hover:scale-[1.02]"
      >
        Enter your house
        <ArrowRight width={16} height={16} />
      </Link>
    </div>
  )
}
