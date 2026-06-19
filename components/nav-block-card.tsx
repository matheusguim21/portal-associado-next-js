import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const accentStyles: Record<string, { border: string; icon: string; glow: string }> = {
  brand: {
    border: 'border-primary/50 hover:border-primary',
    icon: 'bg-primary/15 text-primary',
    glow: 'group-hover:shadow-[0_8px_32px_-8px] group-hover:shadow-primary/25',
  },
  violet: {
    border: 'border-violet-500/40 hover:border-violet-500/70',
    icon: 'bg-violet-500/15 text-violet-400',
    glow: 'group-hover:shadow-[0_8px_32px_-8px] group-hover:shadow-violet-500/25',
  },
  amber: {
    border: 'border-amber-500/40 hover:border-amber-500/70',
    icon: 'bg-amber-500/15 text-amber-400',
    glow: 'group-hover:shadow-[0_8px_32px_-8px] group-hover:shadow-amber-500/25',
  },
  blue: {
    border: 'border-blue-500/40 hover:border-blue-500/70',
    icon: 'bg-blue-500/15 text-blue-400',
    glow: 'group-hover:shadow-[0_8px_32px_-8px] group-hover:shadow-blue-500/25',
  },
  emerald: {
    border: 'border-emerald-500/40 hover:border-emerald-500/70',
    icon: 'bg-emerald-500/15 text-emerald-400',
    glow: 'group-hover:shadow-[0_8px_32px_-8px] group-hover:shadow-emerald-500/25',
  },
}

type NavBlockCardProps = {
  href: string
  label: string
  description: string
  icon: LucideIcon
  accent?: string
  className?: string
  index?: number
  variant?: 'block' | 'tool'
}

export function NavBlockCard({
  href,
  label,
  description,
  icon: Icon,
  accent = 'brand',
  className,
  index = 0,
  variant = 'block',
}: NavBlockCardProps) {
  const styles = accentStyles[accent] ?? accentStyles.brand
  const isTool = variant === 'tool'

  return (
    <Link
      href={href}
      className={cn(
        'nav-card-motion group block h-full animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500',
        className,
      )}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div
        className={cn(
          'relative flex h-full flex-col rounded-xl border bg-card/80 transition-all duration-300 ease-out',
          'shadow-sm shadow-black/5 dark:shadow-black/20',
          'hover:-translate-y-1 hover:bg-card hover:shadow-lg',
          isTool ? 'p-4' : 'p-5',
          styles.border,
          styles.glow,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110',
              isTool ? 'size-10' : 'size-12',
              styles.icon,
            )}
          >
            <Icon className={isTool ? 'size-5' : 'size-6'} />
          </div>
          <ChevronRight className="mt-1 size-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
        <h3
          className={cn(
            'font-semibold text-foreground transition-colors duration-300',
            isTool ? 'mt-3 text-base' : 'mt-4 text-base',
          )}
        >
          {label}
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  )
}
