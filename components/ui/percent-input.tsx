'use client'

import { CurrencyInput } from '@/components/ui/currency-input'

type PercentInputProps = Omit<
  React.ComponentProps<typeof CurrencyInput>,
  'value' | 'onChange' | 'decimalScale' | 'fixedDecimalLength' | 'returnAsNumber' | 'showIcon'
> & {
  value?: number
  onChange?: (value: number) => void
}

export function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value * 100) / 100))
}

export function PercentInput({ value, onChange, ...props }: PercentInputProps) {
  return (
    <CurrencyInput
      {...props}
      value={value}
      onChange={(next) => {
        const numeric = typeof next === 'number' ? next : Number.parseFloat(String(next).replace(',', '.'))
        onChange?.(clampPercent(Number.isNaN(numeric) ? 0 : numeric))
      }}
      suffix="%"
      decimalScale={2}
      fixedDecimalLength={2}
      decimalSeparator=","
      groupSeparator="."
      allowDecimals
      returnAsNumber
      showIcon={false}
      min={0}
      max={100}
    />
  )
}
