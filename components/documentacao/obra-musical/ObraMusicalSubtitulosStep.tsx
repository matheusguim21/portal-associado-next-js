'use client'

import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { useTiposTitulo } from '@/api/endpoints/documentacao/diversos/use-diversos-queries'
import { ObraMusicalSubtituloModal } from '@/components/documentacao/obra-musical/ObraMusicalSubtituloModal'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  formRowActionsConfig,
  type FormRowAction,
} from '@/lib/table-actions/form-row-action-config'
import type {
  CreateObraMusicalFormData,
  ObraMusicalSubtituloItem,
} from '@/schemas/create-obra-musical-schema'

type ObraMusicalSubtitulosStepProps = {
  form: UseFormReturn<CreateObraMusicalFormData>
}

export function ObraMusicalSubtitulosStep({ form }: ObraMusicalSubtitulosStepProps) {
  const subtitulos = form.watch('subtitulos')
  const { data: tiposTitulo } = useTiposTitulo()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const tipoMap = useMemo(
    () => new Map((tiposTitulo ?? []).map((t) => [t.codigo ?? '', t.descricao ?? t.codigo ?? ''])),
    [tiposTitulo],
  )

  const columns = useMemo<ColumnDef<ObraMusicalSubtituloItem>[]>(
    () => [
      { id: 'subtitulo', header: 'Subtítulo', meta: { mobilePrimary: true }, cell: ({ row }) => row.original.subtitulo },
      {
        id: 'tipoTitulo',
        header: 'Tipo título',
        cell: ({ row }) => tipoMap.get(row.original.tipoTitulo) ?? row.original.tipoTitulo,
      },
      {
        id: 'actions',
        header: '',
        meta: { isActionColumn: true },
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ActionButtonsList<FormRowAction, ObraMusicalSubtituloItem>
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
                  'subtitulos',
                  subtitulos.filter((_, i) => i !== row.index),
                  { shouldDirty: true },
                )
              }}
            />
          </div>
        ),
      },
    ],
    [form, subtitulos, tipoMap],
  )

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={() => {
          setEditingIndex(null)
          setModalOpen(true)
        }}
      >
        <Plus className="size-4" data-icon="inline-start" />
        Novo subtítulo
      </Button>
      <DataTable columns={columns} data={subtitulos} />
      <ObraMusicalSubtituloModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialValue={editingIndex != null ? subtitulos[editingIndex] : undefined}
        onSave={(item) => {
          if (editingIndex != null) {
            const next = [...subtitulos]
            next[editingIndex] = item
            form.setValue('subtitulos', next, { shouldDirty: true })
          } else {
            form.setValue('subtitulos', [...subtitulos, item], { shouldDirty: true })
          }
          setEditingIndex(null)
        }}
      />
    </div>
  )
}
