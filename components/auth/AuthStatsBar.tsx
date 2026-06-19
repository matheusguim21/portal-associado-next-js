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
    <div ref={ref} className="flex flex-col items-center gap-0.5">
      <span className="text-2xl font-bold text-[#fafafa] xl:text-3xl">
        {display}
        <span className="text-[#7fd4e8]">{suffix}</span>
      </span>
      <span className="text-xs leading-snug text-[rgba(250,250,250,0.66)]">
        {label}
      </span>
    </div>
  )
}

export function AuthStatsBar() {
  return (
    <div className="relative z-10 w-full border-t border-white/15 py-5">
      <div className="mx-auto flex max-w-5xl items-center justify-around px-8 sm:justify-center sm:gap-24">
        {BRAND_STATS.map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-8 sm:gap-24">
            <AnimatedStat {...stat} />
            {i < BRAND_STATS.length - 1 && (
              <div className="hidden h-8 w-px bg-white/20 sm:block" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
