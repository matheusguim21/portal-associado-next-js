'use client'

import { cn } from '@/lib/utils'

export function EnvironmentBadge({ className }: { className?: string }) {
  const env = process.env.NEXT_PUBLIC_APP_ENV ?? 'development'

  if (env === 'production') return null

  const config =
    env === 'staging'
      ? { label: 'STAGING', className: 'bg-amber-500 text-white' }
      : { label: 'DEV', className: 'bg-emerald-500 text-white' }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium',
        config.className,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-white animate-pulse" />
      {config.label}
    </span>
  )
}
