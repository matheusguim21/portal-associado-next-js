'use client'

import { RadioGroup, RadioGroupItem, RadioGroupLabel } from '@/components/ui/radio-group'

type SimNaoRadioProps = {
  value: boolean
  onChange: (value: boolean) => void
  name: string
}

export function SimNaoRadio({ value, onChange, name }: SimNaoRadioProps) {
  return (
    <RadioGroup>
      <div className="flex items-center gap-2">
        <RadioGroupItem
          id={`${name}-sim`}
          name={name}
          checked={value}
          onChange={() => onChange(true)}
        />
        <RadioGroupLabel htmlFor={`${name}-sim`}>Sim</RadioGroupLabel>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem
          id={`${name}-nao`}
          name={name}
          checked={!value}
          onChange={() => onChange(false)}
        />
        <RadioGroupLabel htmlFor={`${name}-nao`}>Não</RadioGroupLabel>
      </div>
    </RadioGroup>
  )
}
