'use client'

import type { UseFormReturn, FieldValues, Path } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TitularSearchModal } from '@/components/documentacao/titular/TitularSearchModal'
import { cn } from '@/lib/utils'
import type { TitularApi } from '@/types/api/documentacao'

const inputBaseClass =
  'h-9 bg-socinpro-titular text-foreground disabled:opacity-100'

type TitularFieldsWithSearchProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  titularIdName?: Path<T>
  titularCodigoEcadName?: Path<T>
  titularNomeName?: Path<T>
  className?: string
}

export function TitularFieldsWithSearch<T extends FieldValues>({
  form,
  titularIdName = 'titularId' as Path<T>,
  titularCodigoEcadName = 'titularCodigoEcad' as Path<T>,
  titularNomeName = 'titularNome' as Path<T>,
  className,
}: TitularFieldsWithSearchProps<T>) {
  function handleSelect(titular: TitularApi) {
    form.setValue(titularIdName, titular.id as T[Path<T>], { shouldDirty: true })
    form.setValue(
      titularCodigoEcadName,
      (titular.codigoEcad ?? undefined) as T[Path<T>],
      { shouldDirty: true },
    )
    form.setValue(titularNomeName, titular.nome as T[Path<T>], { shouldDirty: true })
  }

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[6rem_6rem_1fr_auto] lg:items-end lg:gap-2',
        className,
      )}
    >
      <FormField
        control={form.control}
        name={titularIdName}
        render={({ field }) => (
          <FormItem className="w-full lg:w-auto">
            <FormLabel>Cód. SOC</FormLabel>
            <FormControl>
              <Input
                value={field.value ?? ''}
                disabled
                readOnly
                className={cn(inputBaseClass, 'w-full')}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={titularCodigoEcadName}
        render={({ field }) => (
          <FormItem className="w-full lg:w-auto">
            <FormLabel>Cód. ECAD</FormLabel>
            <FormControl>
              <Input
                value={field.value ?? ''}
                disabled
                readOnly
                className={cn(inputBaseClass, 'w-full')}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={titularNomeName}
        render={({ field }) => (
          <FormItem className="min-w-0 sm:col-span-2 lg:col-span-1">
            <FormLabel>Titular</FormLabel>
            <div className="flex w-full min-w-0 items-center gap-2">
              <FormControl className="min-w-0 flex-1">
                <Input
                  {...field}
                  value={field.value ?? ''}
                  disabled
                  readOnly
                  className={cn(inputBaseClass, 'w-full')}
                />
              </FormControl>
              <div className="w-9 shrink-0 [&_button]:w-9 [&_button]:px-0 [&_button]:h-9">
                <TitularSearchModal onSelect={handleSelect} compact />
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
