'use client'

import { usePathname } from 'next/navigation'
import { getActiveBlock, type NavBlockId } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type AreaShellProps = {
  children: React.ReactNode
}

export function AreaShell({ children }: AreaShellProps) {
  const pathname = usePathname()
  const block = getActiveBlock(pathname)
  const areaId: NavBlockId | 'inicio' =
    block?.id ?? (pathname === '/inicio' || pathname === '/' ? 'inicio' : 'inicio')

  return (
    <div
      data-area={areaId}
      className={cn('min-h-full', block ? `area-${block.id}` : undefined)}
    >
      {children}
    </div>
  )
}
