'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="radio-group"
      className={cn('flex flex-wrap gap-4', className)}
      role="radiogroup"
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  id,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type="radio"
      id={id}
      data-slot="radio-group-item"
      className={cn(
        'size-4 shrink-0 cursor-pointer rounded-full border border-input text-primary accent-primary disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

function RadioGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label className={cn('cursor-pointer font-normal', className)} {...props} />
}

export { RadioGroup, RadioGroupItem, RadioGroupLabel }
