'use client'

import { useEffect, useRef, useState } from 'react'
import { BarChart3, Music2, ShieldCheck, Sparkles } from 'lucide-react'
import { AuthLogo } from '@/components/auth/AuthLogo'
import { DiaTextReveal } from '../ui/dia-text-reveal'

const BRAND_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: 'Transparência e confiança',
    description:
      'Acompanhe cada etapa da gestão dos seus direitos autorais com total clareza e segurança.',
  },
  {
    icon: Music2,
    title: 'Suas obras e fonogramas',
    description:
      'Cadastre, consulte e mantenha todo o seu repertório organizado em um só lugar.',
  },
  {
    icon: BarChart3,
    title: 'Rendimentos sempre à mão',
    description:
      'Visualize demonstrativos, relatórios financeiros e o histórico de distribuições.',
  },
] as const

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
    <div ref={ref} className="flex flex-col">
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

export function BrandPanel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % BRAND_HIGHLIGHTS.length)
    }, 4500)
    return () => clearInterval(id)
  }, [paused])

  return (
    <aside className="relative z-10 hidden w-[58%] max-w-[46rem] flex-col lg:flex">
      <div className="flex h-full flex-col justify-between p-10 xl:p-14">
        <div className="flex items-center justify-between">
          <AuthLogo className="mx-0 h-12" />
          <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-[rgba(250,250,250,0.82)] backdrop-blur-sm">
            <Sparkles className="size-3.5 text-[#7fd4e8]" />
            Portal do Associado
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <DiaTextReveal
            text="Transparência e confiança para sua música"
            textColor="#fafafa"
            className="max-w-[28rem] text-4xl font-bold leading-tight text-[#fafafa] text-balance xl:text-5xl"
          />
          <p className="max-w-[30rem] text-base leading-relaxed text-[rgba(250,250,250,0.82)]">
            O Portal SOCINPRO reúne tudo o que você precisa para gerir seus
            direitos autorais com segurança, agilidade e controle total.
          </p>

          {/* Destaque interativo que alterna automaticamente */}
          <div
            className="mt-2 flex flex-col gap-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="min-h-[7.5rem] rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-md">
              {BRAND_HIGHLIGHTS.map(({ icon: Icon, title, description }, i) => (
                <div
                  key={title}
                  className={
                    'flex items-start gap-4 transition-all duration-500 ' +
                    (i === active
                      ? 'opacity-100'
                      : 'pointer-events-none absolute opacity-0')
                  }
                  aria-hidden={i !== active}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-[#7fd4e8]">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-[#fafafa]">
                      {title}
                    </span>
                    <span className="text-sm leading-snug text-[rgba(250,250,250,0.74)]">
                      {description}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicadores clicáveis */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Destaques">
              {BRAND_HIGHLIGHTS.map((highlight, i) => (
                <button
                  key={highlight.title}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={highlight.title}
                  onClick={() => setActive(i)}
                  className={
                    'h-1.5 rounded-full transition-all duration-300 ' +
                    (i === active
                      ? 'w-8 bg-[#7fd4e8]'
                      : 'w-3 bg-white/30 hover:bg-white/50')
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
          {BRAND_STATS.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </aside>
  )
}
