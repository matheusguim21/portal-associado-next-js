'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  searchObraMusicalSchema,
  type SearchObraMusicalFormData,
} from '@/schemas/search-obra-musical-schema'
import {
  arquivoRepertorioStatusOptions,
  derivadaOptions,
  nacionalOptions,
  searchKindOptions,
} from '@/lib/search/filter-options'
import {
  validateConsultaObraFilters,
  validateIntegracaoObraFilters,
  validateMeusObraFilters,
} from '@/lib/search/validate-integracao-filters'
import { TitularFieldsWithSearch } from '@/components/documentacao/titular/TitularFieldsWithSearch'
import { SearchFormActions } from '@/components/search-form-actions'
import { SearchFormSection } from '@/components/search-form-section'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import { SelectField } from '@/components/ui/select-field'
import { TableFiltersCard } from '@/components/ui/table-filters'

const defaultValues: SearchObraMusicalFormData = {
  pesquisa: 'COMECANDO',
  titulo: '',
  nacional: 'S',
}

type ObraMusicalSearchFormProps = {
  mode: 'consulta' | 'integracao' | 'meus'
  onSubmit: (data: SearchObraMusicalFormData) => void
  onClear: () => void
  isPending?: boolean
  defaultValues?: Partial<SearchObraMusicalFormData>
  compact?: boolean
}

export function ObraMusicalSearchForm({
  mode,
  onSubmit,
  onClear,
  isPending,
  defaultValues: initialValues,
  compact = false,
}: ObraMusicalSearchFormProps) {
  const form = useForm<SearchObraMusicalFormData>({
    resolver: zodResolver(searchObraMusicalSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  })

  function handleSubmit(data: SearchObraMusicalFormData) {
    const validationError =
      mode === 'meus'
        ? validateMeusObraFilters(data)
        : mode === 'integracao'
          ? validateIntegracaoObraFilters(data)
          : validateConsultaObraFilters(data)

    if (validationError) {
      toast.error(validationError)
      return
    }

    onSubmit(data)
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
          <SearchFormSection title="Identificação" showSeparator={false} className="space-y-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
              <FormField
                control={form.control}
                name="pesquisa"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 lg:col-span-3">
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

              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 lg:col-span-5">
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} maxLength={90} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Cód. SOC</FormLabel>
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
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Cód. ECAD</FormLabel>
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
            </div>
          </SearchFormSection>

          <SearchFormSection title="Classificação" className="space-y-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

              <FormField
                control={form.control}
                name="derivada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Derivada</FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={derivadaOptions}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {mode !== 'meus' && (
                <TitularFieldsWithSearch
                  form={form}
                  className="sm:col-span-2 lg:col-span-3"
                />
              )}
            </div>
          </SearchFormSection>

          {!compact && (
            <SearchFormActions
              onSearch={() => form.handleSubmit(handleSubmit)()}
              onClear={handleClear}
              searching={isPending}
            />
          )}
        </TableFiltersCard>
      </form>
    </Form>
  )
}

export type { SearchObraMusicalFormData }
