'use client'

import * as React from 'react'
import {
  formatMaskedValue,
  maxLengthForMask,
  normalizeMaskedValue,
  type InputMaskType,
} from '@/lib/masks'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type MaskedInputProps = Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> & {
  value?: string
  onChange?: (value: string) => void
  mask?: InputMaskType
  maxDigits?: number
}

export function MaskedInput({
  value = '',
  onChange,
  mask = 'isrc',
  maxDigits = 8,
  className,
  inputMode,
  ...props
}: MaskedInputProps) {
  const maskOptions = { maxDigits }
  const displayValue = formatMaskedValue(mask, value, maskOptions)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(normalizeMaskedValue(mask, e.target.value, maskOptions))
  }

  const resolvedInputMode =
    inputMode ??
    (mask === 'duration' || mask === 'date' || mask === 'monthYear' || mask === 'numeric' ? 'numeric' : undefined)

  const resolvedMaxLength =
    mask === 'numeric' ? maxDigits : (maxLengthForMask(mask) ?? props.maxLength)

  return (
    <Input
      {...props}
      className={cn(className)}
      value={displayValue}
      onChange={handleChange}
      inputMode={resolvedInputMode}
      maxLength={resolvedMaxLength}
    />
  )
}
