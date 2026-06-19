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
    <div className="relative flex min-h-screen">
      {/* ── Imagem de fundo única cobrindo toda a tela ── */}
      <Image
        src="/logos/imagem-bg.png"
        alt=""
        fill
        priority
        aria-hidden
        className="object-cover object-center"
      />

      {/* ── Overlay petróleo sobre toda a tela ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'linear-gradient(155deg, rgba(6, 82, 105, 0.85) 0%, rgba(6, 50, 62, 0.90) 45%, rgba(8, 16, 20, 0.96) 100%)',
        }}
      />

      {/* ── Painel de marca (esquerda) — apenas conteúdo, sem imagem própria ── */}
      <BrandPanel />

      {/* ── Painel de acesso (direita) ── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
        <ThemeToggle className="absolute right-5 top-5 z-10" />

        <div
          className={cn(
            'flex w-full justify-center',
            wide ? 'max-w-[28rem]' : 'max-w-[22rem]',
          )}
        >
          {showCard ? (
            <div
              className="w-full overflow-hidden rounded-2xl border border-white/15 p-6 pt-7 text-[#fafafa] shadow-[0_18px_50px_rgba(6,50,62,0.45)] sm:p-7"
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(16px)',
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
