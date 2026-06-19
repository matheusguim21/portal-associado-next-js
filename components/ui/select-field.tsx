'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { SelectOption } from '@/lib/search/filter-options'

type SelectFieldProps = {
  value?: string
  onValueChange: (value: string | undefined) => void
  options: SelectOption[]
  placeholder?: string
  allowEmpty?: boolean
  emptyLabel?: string
  className?: string
  contentClassName?: string
  id?: string
  disabled?: boolean
}

export function SelectField({
  value,
  onValueChange,
  options,
  placeholder = 'Selecione',
  allowEmpty = true,
  emptyLabel = 'Todos',
  className,
  contentClassName,
  id,
  disabled,
}: SelectFieldProps) {
  const items = allowEmpty
    ? [{ value: '', label: emptyLabel }, ...options]
    : options

  const selectedLabel = items.find((opt) => opt.value === (value ?? ''))?.label

  return (
    <Select
      value={value ?? ''}
      onValueChange={(v) => onValueChange(v === '' ? undefined : v)}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder}>{selectedLabel ?? undefined}</SelectValue>
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {items.map((opt) => (
          <SelectItem key={opt.value || '__empty'} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
