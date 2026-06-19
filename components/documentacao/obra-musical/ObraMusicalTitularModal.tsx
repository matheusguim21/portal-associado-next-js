'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSubcategoriasAutoral } from '@/api/endpoints/documentacao/diversos/use-diversos-queries'
import { TitularFieldsWithSearch } from '@/components/documentacao/titular/TitularFieldsWithSearch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { DatePicker } from '@/components/ui/date-picker'
import { PercentInput, clampPercent } from '@/components/ui/percent-input'
import { SelectField } from '@/components/ui/select-field'
import type { ObraMusicalTitularItem } from '@/schemas/create-obra-musical-schema'
import { optionalIsoDate } from '@/schemas/optional-iso-date'

const titularModalSchema = z.object({
  titularId: z.number({ error: 'Selecione um titular.' }),
  titularNome: z.string().optional(),
  codigoEcad: z.number().optional(),
  subcategoriaCodigo: z.string().min(1, 'Selecione a subcategoria.'),
  percentual: z.number().min(0.01, 'Informe o percentual.').max(100),
  dtInicio: optionalIsoDate,
})

type TitularModalForm = z.infer<typeof titularModalSchema>

type ObraMusicalTitularModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: ObraMusicalTitularItem
  onSave: (value: ObraMusicalTitularItem) => void
}

export function ObraMusicalTitularModal({
  open,
  onOpenChange,
  initialValue,
  onSave,
}: ObraMusicalTitularModalProps) {
  const { data: subcategorias } = useSubcategoriasAutoral()
  const form = useForm<TitularModalForm>({
    resolver: zodResolver(titularModalSchema),
    defaultValues: {
      titularId: undefined,
      titularNome: '',
      codigoEcad: undefined,
      subcategoriaCodigo: '',
      percentual: 100,
      dtInicio: '',
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      initialValue ?? {
        titularId: undefined,
        titularNome: '',
        codigoEcad: undefined,
        subcategoriaCodigo: '',
        percentual: 100,
        dtInicio: '',
      },
    )
  }, [open, initialValue, form])

  const subcategoriaOptions =
    subcategorias?.map((s) => ({
      value: s.codSubCategoria ?? '',
      label: s.descricao ?? s.codSubCategoria ?? '',
    })) ?? []

  function handleSubmit(data: TitularModalForm) {
    onSave({
      titularId: data.titularId,
      titularNome: data.titularNome,
      codigoEcad: data.codigoEcad,
      subcategoriaCodigo: data.subcategoriaCodigo,
      percentual: clampPercent(data.percentual),
      dtInicio: data.dtInicio,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="2xl:min-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialValue ? 'Editar titular' : 'Novo titular'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <TitularFieldsWithSearch
              form={form}
              titularIdName="titularId"
              titularCodigoEcadName="codigoEcad"
              titularNomeName="titularNome"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="subcategoriaCodigo"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Subcategoria</FormLabel>
                    <SelectField
                      value={field.value}
                      onValueChange={field.onChange}
                      options={subcategoriaOptions}
                      allowEmpty={false}
                      placeholder="Selecione"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentual</FormLabel>
                    <FormControl>
                      <PercentInput
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dtInicio"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Data início</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
