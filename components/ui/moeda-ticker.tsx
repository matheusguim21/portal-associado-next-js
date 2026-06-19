'use client'

import type { ComponentProps } from 'react'
import { NumberTicker } from '@/components/ui/number-ticker'
import { cn } from '@/lib/utils'

type MoedaTickerProps = Omit<
  ComponentProps<typeof NumberTicker>,
  'decimalPlaces' | 'locale' | 'currency'
>

export function MoedaTicker({ className, ...props }: MoedaTickerProps) {
  return (
    <NumberTicker
      decimalPlaces={2}
      locale="pt-BR"
      currency="BRL"
      className={cn('inline-block tracking-normal text-inherit', className)}
      {...props}
    />
  )
}
