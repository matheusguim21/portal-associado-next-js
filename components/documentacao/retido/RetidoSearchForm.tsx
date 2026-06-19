'use client'

import { RotateCcw, Search } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { RetidoTab } from '@/types/api/documentacao/retido'
import {
  CONCATENACAO_PESQUISA_VALUES,
  PESQUISA_RETIDO_VALUES,
  RETIDO_ORDENACAO_AUTOR_VALUES,
  RETIDO_ORDENACAO_CONEXO_VALUES,
  RETIDO_ORDENACAO_TITULAR_VALUES,
  SELECAO_DIGITAL_VALUES,
} from '@/types/api/documentacao/retido'
import {
  retidoExigePesquisa1Autoral,
  retidoExigePesquisa1Conexo,
  retidoExigePesquisa1Titular,
} from '@/lib/retido-pesquisa'
import {
  CONCATENACAO_LABELS,
  PESQUISA_RETIDO_LABELS,
  RETIDO_ORDENACAO_AUTOR_LABELS,
  RETIDO_ORDENACAO_CONEXO_LABELS,
  RETIDO_ORDENACAO_TITULAR_LABELS,
  RETIDO_UI_LABELS,
  SELECAO_DIGITAL_LABELS,
} from '@/lib/retido-labels'
import { cn } from '@/lib/utils'
import {
  retidoSearchFormDefaults,
  type RetidoSearchFormGetValuesRef,
} from '@/components/documentacao/retido/retido-filtro-utils'
import {
  createRetidoSearchSchema,
  type RetidoSearchFormValues,
} from '@/schemas/search-retido-schema'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { SelectField } from '@/components/ui/select-field'
import { TableFiltersCard } from '@/components/ui/table-filters'

const modoPesquisaBtnClass =
  'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50'

export interface RetidoSearchFormProps {
  tab: RetidoTab
  onSubmit: (data: RetidoSearchFormValues) => void
  onClear?: () => void
  isPending?: boolean
  initialValues?: Partial<RetidoSearchFormValues>
  formGetValuesRef?: RetidoSearchFormGetValuesRef
  onModoPesquisaChange?: (modo: RetidoTab) => void
}

export function RetidoSearchForm({
  tab,
  onSubmit,
  onClear,
  isPending,
  initialValues,
  formGetValuesRef,
  onModoPesquisaChange,
}: RetidoSearchFormProps) {
  const labels = RETIDO_UI_LABELS

  const ordenacaoValues =
    tab === 'autoral'
      ? RETIDO_ORDENACAO_AUTOR_VALUES
      : tab === 'titular'
        ? RETIDO_ORDENACAO_TITULAR_VALUES
        : RETIDO_ORDENACAO_CONEXO_VALUES
  const ordenacaoLabels =
    tab === 'autoral'
      ? RETIDO_ORDENACAO_AUTOR_LABELS
      : tab === 'titular'
        ? RETIDO_ORDENACAO_TITULAR_LABELS
        : RETIDO_ORDENACAO_CONEXO_LABELS

  const ordenacaoOptions = useMemo(
    () =>
      ordenacaoValues
        .map((v) => ({ value: v, label: ordenacaoLabels[v] ?? v }))
        .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' })),
    [ordenacaoValues, ordenacaoLabels],
  )

  const pesquisaOptions = useMemo(
    () =>
      PESQUISA_RETIDO_VALUES.map((v) => ({
        value: v,
        label: PESQUISA_RETIDO_LABELS[v] ?? v,
      })).sort((a, b) => a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' })),
    [],
  )

  const concatenacaoOptions = useMemo(
    () =>
      CONCATENACAO_PESQUISA_VALUES.map((v) => ({
        value: v,
        label: CONCATENACAO_LABELS[v] ?? v,
      })),
    [],
  )

  const retidoSearchSchema = useMemo(() => createRetidoSearchSchema(tab), [tab])

  const valuesFromProps = useMemo(
    () => retidoSearchFormDefaults(initialValues),
    [initialValues],
  )

  const form = useForm<RetidoSearchFormValues>({
    resolver: zodResolver(retidoSearchSchema),
    values: valuesFromProps,
  })

  const handleSubmit = () => form.handleSubmit(onSubmit)()

  useLayoutEffect(() => {
    if (!formGetValuesRef) return
    formGetValuesRef.current = () => form.getValues()
    return () => {
      formGetValuesRef.current = null
    }
  }, [form, formGetValuesRef])

  const retidoOrdenacao1 = form.watch('retidoOrdenacao1')
  const concatenacao = form.watch('concatenacaoPesquisa')

  const exigePesquisa1 =
    tab === 'autoral'
      ? retidoExigePesquisa1Autoral(retidoOrdenacao1)
      : tab === 'titular'
        ? retidoExigePesquisa1Titular(retidoOrdenacao1)
        : retidoExigePesquisa1Conexo(retidoOrdenacao1)

  const showSegundoBloco = Boolean(concatenacao?.trim())

  const tinhaSegundoCriterioRef = useRef(showSegundoBloco)
  useEffect(() => {
    const temSegundo = Boolean(concatenacao?.trim())
    if (tinhaSegundoCriterioRef.current && !temSegundo) {
      form.setValue('retidoOrdenacao2', '', { shouldDirty: true, shouldValidate: true })
      form.setValue('pesquisa2', '', { shouldDirty: true, shouldValidate: true })
      form.setValue('texto2', '', { shouldDirty: true, shouldValidate: true })
    }
    tinhaSegundoCriterioRef.current = temSegundo
  }, [concatenacao, form])

  const handleClear = () => {
    form.reset({
      retidoOrdenacao1: '',
      pesquisa1: '',
      texto1: '',
      concatenacaoPesquisa: '',
      retidoOrdenacao2: '',
      pesquisa2: '',
      texto2: '',
      selecaoDigital: 'TODOS',
    })
    onClear?.()
  }

  const gridRowClass =
    'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-start'

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit()
          }
        }}
        className="space-y-6 w-full"
      >
        <TableFiltersCard layout="stacked">
          <div className={gridRowClass}>
            <FormField
              control={form.control}
              name="retidoOrdenacao1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.fields.ordenacao1}</FormLabel>
                  <FormControl>
                    <SelectField
                      value={field.value}
                      onValueChange={(v) => field.onChange(v ?? '')}
                      options={ordenacaoOptions}
                      placeholder={labels.placeholders.ordenacao}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {exigePesquisa1 ? (
              <FormField
                control={form.control}
                name="pesquisa1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.fields.pesquisa1}</FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={(v) => field.onChange(v ?? '')}
                        options={pesquisaOptions}
                        placeholder={labels.placeholders.pesquisa}
                        disabled={isPending}
                        allowEmpty={false}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <div className="hidden min-h-10 lg:block" aria-hidden />
            )}

            <FormField
              control={form.control}
              name="texto1"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{labels.fields.texto1}</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="concatenacaoPesquisa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.fields.concatenacao}</FormLabel>
                  <FormControl>
                    <SelectField
                      value={field.value}
                      onValueChange={(v) => field.onChange(v ?? '')}
                      options={concatenacaoOptions}
                      placeholder={labels.placeholders.semSegundoCriterio}
                      disabled={isPending}
                      emptyLabel={labels.placeholders.semSegundoCriterio}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {showSegundoBloco && (
            <div className={`${gridRowClass} border-t border-border pt-4 mt-4`}>
              <FormField
                control={form.control}
                name="retidoOrdenacao2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.fields.ordenacao2}</FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={(v) => field.onChange(v ?? '')}
                        options={ordenacaoOptions}
                        placeholder={labels.placeholders.ordenacao}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pesquisa2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.fields.pesquisa2}</FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={(v) => field.onChange(v ?? '')}
                        options={pesquisaOptions}
                        placeholder={labels.placeholders.pesquisa}
                        disabled={isPending}
                        allowEmpty={false}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="texto2"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{labels.fields.texto2}</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="off" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="hidden lg:block" aria-hidden />
            </div>
          )}

          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between mt-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <div
                className="flex h-auto w-fit flex-wrap justify-start gap-1 bg-transparent p-0"
                role="group"
                aria-label={labels.tabs.ariaModoPesquisa}
              >
                {(['autoral', 'conexo', 'titular'] as const).map((modo) => (
                  <Button
                    key={modo}
                    type="button"
                    variant="ghost"
                    className={cn(
                      modoPesquisaBtnClass,
                      tab === modo
                        ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                        : 'hover:bg-primary/10',
                    )}
                    disabled={isPending || !onModoPesquisaChange}
                    aria-pressed={tab === modo}
                    onClick={() => {
                      if (modo === tab) return
                      onModoPesquisaChange?.(modo)
                    }}
                  >
                    {modo === 'autoral'
                      ? labels.tabs.autoral
                      : modo === 'conexo'
                        ? labels.tabs.conexo
                        : labels.tabs.titular}
                  </Button>
                ))}
              </div>

              <FormField
                control={form.control}
                name="selecaoDigital"
                render={({ field }) => (
                  <FormItem className="border-border sm:border-l sm:pl-4 space-y-0">
                    <FormLabel className="mb-2 block text-sm">
                      {labels.fields.selecaoDigital}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup className="flex flex-wrap gap-4">
                        {SELECAO_DIGITAL_VALUES.map((v) => (
                          <div key={v} className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={v}
                              id={`retido-dig-${v}`}
                              name="selecaoDigital"
                              disabled={isPending}
                              checked={field.value === v}
                              onChange={() => field.onChange(v)}
                            />
                            <Label
                              htmlFor={`retido-dig-${v}`}
                              className="font-normal cursor-pointer"
                            >
                              {SELECAO_DIGITAL_LABELS[v] ?? v}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button type="button" disabled={isPending} onClick={handleSubmit}>
                <Search className="mr-2 size-4" />
                {labels.actions.search}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={isPending}
              >
                <RotateCcw className="mr-2 size-4" />
                {labels.actions.clear}
              </Button>
            </div>
          </div>
        </TableFiltersCard>
      </form>
    </Form>
  )
}
