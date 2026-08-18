"use client"

import { useEffect, useRef, useState } from "react"

export function XpRing({
  value,
  max,
  size = 120,
  stroke = 8,
  label,
  sublabel,
}: {
  value: number
  max: number
  size?: number
  stroke?: number
  label: string
  sublabel?: string
}) {
  const [progress, setProgress] = useState(0)
  const ref = useRef<SVGSVGElement>(null)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, value / max)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver((e) => {
      if (e[0]?.isIntersecting) {
        requestAnimationFrame(() => setProgress(pct))
      }
    })
    io.observe(node)
    return () => io.disconnect()
  }, [pct])

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--house)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="font-serif text-2xl text-foreground">{label}</span>
        {sublabel && <span className="mt-1 text-[11px] text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  )
}
