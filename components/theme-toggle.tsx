'use client'

import { useTheme } from '@teispace/next-themes'
import { useEffect, useState } from 'react'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedTheme = mounted && theme === 'dark' ? 'dark' : 'light'
  const isDark = resolvedTheme === 'dark'

  return (
    <AnimatedThemeToggler
      theme={resolvedTheme}
      onThemeChange={setTheme}
      aria-label={
        mounted
          ? isDark
            ? 'Mudar para tema claro'
            : 'Mudar para tema escuro'
          : 'Alternar tema'
      }
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'icon' }),
        'text-muted-foreground hover:text-foreground [&_svg]:size-4',
        className
      )}
    />
  )
}
