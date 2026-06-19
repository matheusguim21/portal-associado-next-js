'use client'

import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { useElementosObra } from '@/api/endpoints/documentacao/diversos/use-diversos-queries'
import { ObraMusicalElementoIaModal } from '@/components/documentacao/obra-musical/ObraMusicalElementoIaModal'
import { SimNaoRadio } from '@/components/documentacao/obra-musical/SimNaoRadio'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectField } from '@/components/ui/select-field'
import {
  formRowActionsConfig,
  type FormRowAction,
} from '@/lib/table-actions/form-row-action-config'
import type {
  CreateObraMusicalFormData,
  ObraMusicalElementoIaItem,
} from '@/schemas/create-obra-musical-schema'

type ObraMusicalIaStepProps = {
  form: UseFormReturn<CreateObraMusicalFormData>
}

export function ObraMusicalIaStep({ form }: ObraMusicalIaStepProps) {
  const usoIA = form.watch('usoIA')
  const elementosIa = form.watch('elementosIa')
  const { data: elementos } = useElementosObra()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const elementoMap = useMemo(
    () => new Map((elementos ?? []).map((e) => [String(e.codigo ?? ''), e.nome ?? ''])),
    [elementos],
  )

  const columns = useMemo<ColumnDef<ObraMusicalElementoIaItem>[]>(
    () => [
      {
        id: 'elemento',
        header: 'Elemento',
        meta: { mobilePrimary: true },
        cell: ({ row }) =>
          elementoMap.get(row.original.elementoCodigo) ?? row.original.elementoCodigo,
      },
      { id: 'ferramentas', header: 'Ferramenta', cell: ({ row }) => row.original.ferramentas || '—' },
      { id: 'observacao', header: 'Observação', cell: ({ row }) => row.original.observacao || '—' },
      {
        id: 'prompts',
        header: 'Prompts',
        cell: ({ row }) => row.original.promptFiles?.length ?? 0,
      },
      {
        id: 'actions',
        header: '',
        meta: { isActionColumn: true },
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ActionButtonsList<FormRowAction, ObraMusicalElementoIaItem>
              actionsConfig={formRowActionsConfig}
              actionsToShow={['edit', 'delete']}
              item={row.original}
              onAction={(action) => {
                if (action === 'edit') {
                  setEditingIndex(row.index)
                  setModalOpen(true)
                  return
                }
                form.setValue(
                  'elementosIa',
                  elementosIa.filter((_, i) => i !== row.index),
                  { shouldDirty: true },
                )
              }}
            />
          </div>
        ),
      },
    ],
    [elementoMap, elementosIa, form],
  )

  return (
    <Form {...form}>
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">IA e áudio</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="usoIA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Houve uso de IA</FormLabel>
                  <SimNaoRadio
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      if (!value) {
                        form.setValue('tpUsoIA', undefined)
                        form.setValue('elementosIa', [])
                      }
                    }}
                    name="usoIA"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tpUsoIA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de uso</FormLabel>
                  <SelectField
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!usoIA}
                    options={[
                      { value: 'T', label: 'Total' },
                      { value: 'P', label: 'Parcial' },
                    ]}
                    allowEmpty
                    emptyLabel="Selecione"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkAudio"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Link do áudio</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {usoIA ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Elementos de IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                onClick={() => {
                  setEditingIndex(null)
                  setModalOpen(true)
                }}
              >
                <Plus className="size-4" data-icon="inline-start" />
                Novo elemento IA
              </Button>
              <DataTable columns={columns} data={elementosIa} />
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-muted-foreground">
            Se não houve uso de IA na obra, você pode avançar para a revisão.
          </p>
        )}

        <ObraMusicalElementoIaModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          initialValue={editingIndex != null ? elementosIa[editingIndex] : undefined}
          onSave={(item) => {
            if (editingIndex != null) {
              const next = [...elementosIa]
              next[editingIndex] = item
              form.setValue('elementosIa', next, { shouldDirty: true })
            } else {
              form.setValue('elementosIa', [...elementosIa, item], { shouldDirty: true })
            }
            setEditingIndex(null)
          }}
        />
      </div>
    </Form>
  )
}
