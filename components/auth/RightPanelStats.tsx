'use client'

import { useEffect, useRef, useState } from 'react'

const BRAND_STATS = [
  { value: 30, suffix: '+', label: 'Anos de atuação' },
  { value: 100, suffix: '%', label: 'Gestão transparente' },
  { value: 24, suffix: '/7', label: 'Acesso ao portal' },
] as const

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()

        const duration = 1200
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(eased * value))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <div ref={ref} className="flex flex-col items-center">
      <span className="text-2xl font-bold text-[#fafafa]">
        {display}
        <span className="text-[#7fd4e8]">{suffix}</span>
      </span>
      <span className="text-xs leading-snug text-[rgba(250,250,250,0.66)]">
        {label}
      </span>
    </div>
  )
}

export function RightPanelStats() {
  return (
    <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-5">
      {BRAND_STATS.map((stat) => (
        <AnimatedStat key={stat.label} {...stat} />
      ))}
    </div>
  )
}
