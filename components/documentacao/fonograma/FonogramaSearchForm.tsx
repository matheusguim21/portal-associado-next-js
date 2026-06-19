'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  searchFonogramaSchema,
  type SearchFonogramaFormData,
} from '@/schemas/search-fonograma-schema'
import {
  arquivoRepertorioStatusOptions,
  nacionalOptions,
  searchKindOptions,
  situacaoCadastralFonogramaOptions,
  tipoObmPopOptions,
} from '@/lib/search/filter-options'
import {
  validateIntegracaoFonogramaFilters,
  validateMeusFonogramaFilters,
} from '@/lib/search/validate-integracao-filters'
import { cn } from '@/lib/utils'
import { ObraMusicalSearchModal } from '@/components/documentacao/obra-musical/ObraMusicalSearchModal'
import { PoutPourritSearchModal } from '@/components/documentacao/pout-pourrit/PoutPourritSearchModal'
import { TitularFieldsWithSearch } from '@/components/documentacao/titular/TitularFieldsWithSearch'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import { RadioGroup, RadioGroupItem, RadioGroupLabel } from '@/components/ui/radio-group'
import { SelectField } from '@/components/ui/select-field'
import { TableFiltersCard } from '@/components/ui/table-filters'
import { SearchFormActions } from '@/components/search-form-actions'
import { SearchFormSection } from '@/components/search-form-section'
import { Button } from '@/components/ui/button'
import type { ObraMusicalApi, PoutPourritApi } from '@/types/api/documentacao'

const defaultValues: SearchFonogramaFormData = {
  pesquisa: 'CONTENDO',
  tipoObmPop: 'OBRA_MUSICAL',
  titulo: '',
  isrc: '',
}

const fieldGridClass =
  'grid w-full grid-cols-1 items-end gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 xl:grid-cols-10'

const obraLinkedInputClass = (tipoObmPop: string | undefined) =>
  cn(
    'cursor-default',
    tipoObmPop === 'POUT_POURRIT'
      ? 'bg-socinpro-pout-pourrit text-foreground'
      : 'bg-socinpro-obra text-foreground',
  )

type FonogramaSearchFormProps = {
  mode: 'consulta' | 'integracao' | 'meus'
  onSubmit: (data: SearchFonogramaFormData) => void
  onClear: () => void
  isPending?: boolean
  defaultValues?: Partial<SearchFonogramaFormData>
  showTipoObmPop?: boolean
}

export function FonogramaSearchForm({
  mode,
  onSubmit,
  onClear,
  isPending,
  defaultValues: initialValues,
  showTipoObmPop = true,
}: FonogramaSearchFormProps) {
  const form = useForm<SearchFonogramaFormData>({
    resolver: zodResolver(searchFonogramaSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  })

  const [obraModalOpen, setObraModalOpen] = useState(false)
  const [poutModalOpen, setPoutModalOpen] = useState(false)
  const tipoObmPop = form.watch('tipoObmPop')
  const prevTipoObmPop = useRef(tipoObmPop)

  const showTipoObra = showTipoObmPop && mode !== 'meus'
  const tituloColSpan = showTipoObra ? 'lg:col-span-4 xl:col-span-6' : 'lg:col-span-6 xl:col-span-8'

  useEffect(() => {
    if (prevTipoObmPop.current !== tipoObmPop && prevTipoObmPop.current !== undefined) {
      form.setValue('titulo', '')
      form.setValue('codigoEcadObraPoutPourrit', undefined)
      form.setValue('codigoSocObraPoutPourrit', undefined)
    }
    prevTipoObmPop.current = tipoObmPop
  }, [tipoObmPop, form])

  function handleSubmit(data: SearchFonogramaFormData) {
    if (mode === 'integracao') {
      const validationError = validateIntegracaoFonogramaFilters(data)
      if (validationError) {
        toast.error(validationError)
        return
      }
    }

    if (mode === 'meus') {
      const validationError = validateMeusFonogramaFilters(data)
      if (validationError) {
        toast.error(validationError)
        return
      }
    }

    onSubmit({
      ...data,
      tipoObmPop: data.tipoObmPop ?? 'OBRA_MUSICAL',
    })
  }

  function handleObraSelect(obra: ObraMusicalApi) {
    form.setValue('titulo', obra.titulo ?? '', { shouldDirty: true })
    form.setValue('codigoEcadObraPoutPourrit', obra.codigoEcad, { shouldDirty: true })
    form.setValue('codigoSocObraPoutPourrit', obra.id, { shouldDirty: true })
  }

  function handlePoutSelect(pout: PoutPourritApi) {
    form.setValue('titulo', pout.titulo ?? '', { shouldDirty: true })
    form.setValue('codigoEcadObraPoutPourrit', pout.codEcad, { shouldDirty: true })
    form.setValue('codigoSocObraPoutPourrit', pout.id, { shouldDirty: true })
  }

  function handleClear() {
    form.reset({ ...defaultValues, ...initialValues })
    onClear()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            form.handleSubmit(handleSubmit)()
          }
        }}
      >
        <TableFiltersCard layout="stacked" className="p-3">
          <SearchFormSection title="Obra vinculada" showSeparator={false} className="space-y-2">
            <div className={fieldGridClass}>
              <FormField
                control={form.control}
                name="pesquisa"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 lg:col-span-1">
                    <FormLabel>Tipo de pesquisa</FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={searchKindOptions}
                        allowEmpty={false}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {showTipoObra && (
                <FormField
                  control={form.control}
                  name="tipoObmPop"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2 lg:col-span-2 h-full">
                      <FormLabel>Tipo obra</FormLabel>
                      <FormControl>
                        <RadioGroup className="flex flex-row flex-wrap gap-6">
                          {tipoObmPopOptions.map((opt) => (
                            <div key={opt.value} className="flex items-center gap-2">
                              <RadioGroupItem
                                id={`tipo-${opt.value}`}
                                name="tipoObmPop"
                                value={opt.value}
                                checked={field.value === opt.value}
                                onChange={() => field.onChange(opt.value)}
                              />
                              <RadioGroupLabel htmlFor={`tipo-${opt.value}`}>
                                {opt.label}
                              </RadioGroupLabel>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="codigoSocObraPoutPourrit"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1 xl:col-span-1">
                    <FormLabel>Cód. SOC</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value ?? ''}
                        readOnly
                        disabled
                        className={obraLinkedInputClass(tipoObmPop)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigoEcadObraPoutPourrit"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1 xl:col-span-1">
                    <FormLabel>Cód. ECAD</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value ?? ''}
                        readOnly
                        disabled
                        className={obraLinkedInputClass(tipoObmPop)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem className={tituloColSpan}>
                    <FormLabel>
                      {tipoObmPop === 'POUT_POURRIT' ? 'Título pout pourrit' : 'Título obra musical'}
                    </FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center gap-2">
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          readOnly
                          className={cn(
                            'min-w-0 flex-1 truncate',
                            obraLinkedInputClass(tipoObmPop),
                          )}
                        />
                        <div className="shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              tipoObmPop === 'POUT_POURRIT'
                                ? setPoutModalOpen(true)
                                : setObraModalOpen(true)
                            }
                          >
                            <Search className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </SearchFormSection>

          <SearchFormSection title="Identificação" className="space-y-2">
            <div className={fieldGridClass}>
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1 xl:col-span-1">
                    <FormLabel>Cód. SOC (fonograma)</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="numeric"
                        maxDigits={15}
                        value={field.value != null ? String(field.value) : ''}
                        onChange={(v) => field.onChange(v ? Number(v) : undefined)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigoEcad"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1 xl:col-span-1">
                    <FormLabel>Cód. ECAD (fonograma)</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="numeric"
                        maxDigits={15}
                        value={field.value != null ? String(field.value) : ''}
                        onChange={(v) => field.onChange(v ? Number(v) : undefined)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isrc"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 lg:col-span-1">
                    <FormLabel>ISRC</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="isrc"
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        placeholder="XX-XXX-XX-XXXX"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gra"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 lg:col-span-1">
                    <FormLabel>GRA</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="numeric"
                        maxDigits={8}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </SearchFormSection>

          <SearchFormSection title="Classificação" className="space-y-2">
            <div className={fieldGridClass}>
              <FormField
                control={form.control}
                name="situacaoCadastral"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 lg:col-span-1">
                    <FormLabel>Situação cadastral</FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={situacaoCadastralFonogramaOptions}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nacional"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nacional</FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={nacionalOptions}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={arquivoRepertorioStatusOptions}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </SearchFormSection>

          {mode !== 'meus' && (
            <SearchFormSection title="Titular" className="space-y-2">
              <TitularFieldsWithSearch form={form} />
            </SearchFormSection>
          )}

          <SearchFormActions
            onSearch={() => form.handleSubmit(handleSubmit)()}
            onClear={handleClear}
            searching={isPending}
          />
        </TableFiltersCard>
      </form>

      <ObraMusicalSearchModal
        open={obraModalOpen}
        onOpenChange={setObraModalOpen}
        onSelect={handleObraSelect}
        hideTrigger
      />
      <PoutPourritSearchModal
        open={poutModalOpen}
        onOpenChange={setPoutModalOpen}
        onSelect={handlePoutSelect}
        hideTrigger
      />
    </Form>
  )
}

export type { SearchFonogramaFormData }
