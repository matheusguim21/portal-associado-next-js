'use client'

import { useRef, useState } from 'react'
import CurrencyInputBase from 'react-currency-input-field'
import { CircleDollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const inputClassName =
  'h-8 w-full min-w-0 rounded-md border border-input dark:border-neutral-500 bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'

type CurrencyInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof CurrencyInputBase>,
  'onValueChange' | 'onChange' | 'className'
> & {
  onChange?: (value: string | number) => void
  value?: string | number
  className?: string
  decimalScale?: number
  fixedDecimalLength?: number
  returnAsNumber?: boolean
  showIcon?: boolean
  allowNegativeValue?: boolean
}

const createTransformRawValue =
  (
    decimalPlaces: number,
    allowNegative: boolean,
    max?: number | string,
    min?: number | string,
  ) =>
  (raw: string) => {
    const isNegative = allowNegative && (raw.startsWith('-') || raw.endsWith('-'))
    const prefix = isNegative ? '-' : ''
    const numeric = raw.replace(/\D/g, '').slice(0, 30)

    if (!numeric) {
      if (allowNegative && isNegative) {
        return `${prefix}0,${'0'.repeat(decimalPlaces)}`
      }
      return ''
    }

    let numericValue: number
    if (numeric.length <= decimalPlaces) {
      numericValue = Number.parseFloat(`0.${numeric.padStart(decimalPlaces, '0')}`)
    } else {
      numericValue = Number.parseFloat(
        `${numeric.slice(0, numeric.length - decimalPlaces)}.${numeric.slice(-decimalPlaces)}`,
      )
    }
    if (isNegative) numericValue = -numericValue

    if (max !== undefined && !Number.isNaN(numericValue)) {
      const maxValue = typeof max === 'string' ? Number.parseFloat(max) : max
      if (!Number.isNaN(maxValue) && numericValue > maxValue) {
        return undefined as unknown as string
      }
    }

    if (min !== undefined && !Number.isNaN(numericValue)) {
      const minValue = typeof min === 'string' ? Number.parseFloat(min) : min
      if (!Number.isNaN(minValue) && numericValue < minValue) {
        return undefined as unknown as string
      }
    }

    if (numeric.length <= decimalPlaces) {
      return `${prefix}0,${numeric}`
    }

    const integer = numeric.slice(0, numeric.length - decimalPlaces)
    const decimal = numeric.slice(-decimalPlaces)

    return `${prefix}${integer},${decimal}`
  }

export function CurrencyInput({
  onChange,
  className,
  decimalScale = 10,
  fixedDecimalLength = 10,
  returnAsNumber = false,
  showIcon = true,
  value,
  min,
  max,
  allowNegativeValue = false,
  ...props
}: CurrencyInputProps) {
  const baseTransformRawValue = createTransformRawValue(
    decimalScale,
    allowNegativeValue,
    max,
    min,
  )
  const lastTransformOutputRef = useRef<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const transformRawValue = (raw: string) => {
    const result = baseTransformRawValue(raw)
    if (result !== undefined && result !== '') {
      lastTransformOutputRef.current = result
    }
    return result
  }

  const convertStringToNumber = (raw: string): number => {
    const isNegative = raw.startsWith('-')
    const cleaned = raw.replace(/-/g, '').replace(/\./g, '').replace(',', '.')
    const numericValue = Number.parseFloat(cleaned)
    if (Number.isNaN(numericValue)) return 0
    return isNegative ? -Math.abs(numericValue) : numericValue
  }

  const clamp = (n: number): number => {
    const minNum = typeof min === 'string' ? Number.parseFloat(min) : min
    const maxNum = typeof max === 'string' ? Number.parseFloat(max) : max
    if (minNum != null && !Number.isNaN(minNum) && n < minNum) return minNum
    if (maxNum != null && !Number.isNaN(maxNum) && n > maxNum) return maxNum
    return n
  }

  const formatNumberToString = (
    val: string | number | undefined,
    decimals: number = decimalScale,
  ): string => {
    if (typeof val === 'number') {
      return val.toFixed(decimals).replace('.', ',')
    }
    if (typeof val === 'string') {
      return val
    }
    return decimals > 0 ? `0,${'0'.repeat(decimals)}` : '0'
  }

  const formattedValue = formatNumberToString(value, decimalScale)

  const isZero =
    value === 0 ||
    value === '0' ||
    (typeof value === 'string' && Number.parseFloat(value.replace(',', '.')) === 0)
  const displayValue =
    isFocused && isZero && lastTransformOutputRef.current
      ? lastTransformOutputRef.current
      : formattedValue
  const displayDecimalScale =
    isFocused && isZero && lastTransformOutputRef.current
      ? (lastTransformOutputRef.current.split(',')[1]?.length ?? decimalScale)
      : decimalScale

  const inputElement = (
    <CurrencyInputBase
      {...props}
      allowDecimals
      allowNegativeValue={allowNegativeValue}
      decimalScale={displayDecimalScale}
      fixedDecimalLength={fixedDecimalLength}
      onFocus={(e) => {
        setIsFocused(true)
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        setIsFocused(false)
        lastTransformOutputRef.current = null
        props.onBlur?.(e)
      }}
      onValueChange={(val) => {
        if (!onChange) return
        const numericValue = convertStringToNumber(val || '0')
        const clamped = clamp(numericValue)
        if (returnAsNumber) {
          if (fixedDecimalLength === 0) {
            onChange(Math.floor(clamped))
          } else {
            onChange(clamped)
          }
        } else {
          onChange(clamped.toFixed(fixedDecimalLength).replace('.', ','))
        }
      }}
      groupSeparator="."
      decimalSeparator=","
      transformRawValue={transformRawValue}
      className={cn(inputClassName, showIcon && 'pl-9', className)}
      value={displayValue}
    />
  )

  return (
    <div className="relative flex w-full items-center">
      {showIcon && (
        <span
          className={cn(
            'pointer-events-none absolute left-2.5 flex h-8 shrink-0 items-center justify-center',
            props.disabled && 'text-muted-foreground',
          )}
        >
          <CircleDollarSign className="size-4" strokeWidth={1.5} />
        </span>
      )}
      {inputElement}
    </div>
  )
}
