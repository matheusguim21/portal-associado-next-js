import Image from 'next/image'
import { cn } from '@/lib/utils'
import { AuthLogo } from '@/components/auth/AuthLogo'
import { ThemeToggle } from '../theme-toggle'
import { DiaTextReveal } from '../ui/dia-text-reveal'
import { BrandPanel } from './BrandPanel'

interface AuthLayoutProps {
  title?: string
  subtitle?: string
  wide?: boolean
  showLogo?: boolean
  showCard?: boolean
  children?: React.ReactNode
}

export function AuthLayout({
  title,
  subtitle,
  wide = false,
  showLogo = true,
  showCard = true,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen bg-background">
      {/* ── Painel de marca (esquerda) ─────────────────────────────── */}
      <BrandPanel />

      {/* ── Painel de acesso (direita) ─────────────────────────────── */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        {/* Fundo que irradia a partir do painel esquerdo */}
        <Image
          src="/logos/imagem-bg.png"
          alt=""
          fill
          priority
          aria-hidden
          className="scale-110 object-cover object-left opacity-40 dark:opacity-30"
        />
        {/* Degradê horizontal: lado esquerdo aberto (imagem visível), dissipando até o fundo sólido à direita */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/40 via-background/80 to-background"
          aria-hidden
        />
        {/* Brilho petróleo irradiando da borda esquerda */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(120% 90% at 0% 50%, rgba(11, 82, 105, 0.30) 0%, rgba(11, 82, 105, 0.10) 35%, transparent 60%)',
          }}
        />

        <ThemeToggle className="absolute right-5 top-5 z-10" />

        <div
          className={cn(
            'relative z-10 flex w-full justify-center',
            wide ? 'max-w-[28rem]' : 'max-w-[22rem]',
          )}
        >
          {showCard ? (
            <div className="w-full overflow-hidden rounded-2xl border border-white/15 p-6 pt-7 text-[#fafafa] shadow-[0_18px_50px_rgba(6,50,62,0.35)] sm:p-7"
              style={{
                background:
                  'linear-gradient(160deg, #0b5269 0%, #074457 50%, #06303e 100%)',
              }}
            >
              {showLogo && (
                <div className="mb-5 flex justify-center lg:hidden">
                  <AuthLogo />
                </div>
              )}

              <div className="flex flex-col items-center justify-center">
                {title && (
                  <DiaTextReveal
                    text={title}
                    textColor="#fafafa"
                    className="mb-2 text-center text-[1.375rem] font-bold leading-tight text-[#fafafa]"
                  />
                )}

                {subtitle && (
                  <DiaTextReveal
                    text={subtitle}
                    textColor="rgba(250,250,250,0.92)"
                    className="mb-5 text-center text-[0.8125rem] font-medium leading-snug text-[rgba(250,250,250,0.92)]"
                  />
                )}
              </div>

              {children}
            </div>
          ) : (
            <div className="text-center">{children}</div>
          )}
        </div>
      </main>
    </div>
  )
}
