'use client'

import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { useCategoriasReferencia } from '@/api/endpoints/documentacao/diversos/use-diversos-queries'
import { ObraMusicalReferenciaModal } from '@/components/documentacao/obra-musical/ObraMusicalReferenciaModal'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  formRowActionsConfig,
  type FormRowAction,
} from '@/lib/table-actions/form-row-action-config'
import type {
  CreateObraMusicalFormData,
  ObraMusicalReferenciaItem,
} from '@/schemas/create-obra-musical-schema'

type ObraMusicalReferenciasStepProps = {
  form: UseFormReturn<CreateObraMusicalFormData>
}

export function ObraMusicalReferenciasStep({ form }: ObraMusicalReferenciasStepProps) {
  const referencias = form.watch('referencias')
  const { data: categorias } = useCategoriasReferencia()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const categoriaMap = useMemo(
    () => new Map((categorias ?? []).map((c) => [c.codigo ?? '', c.descricao ?? c.codigo ?? ''])),
    [categorias],
  )

  const columns = useMemo<ColumnDef<ObraMusicalReferenciaItem>[]>(
    () => [
      { id: 'referencia', header: 'Referência', meta: { mobilePrimary: true }, cell: ({ row }) => row.original.referencia },
      {
        id: 'categoria',
        header: 'Categoria',
        cell: ({ row }) =>
          categoriaMap.get(row.original.categoriaCodigo) ?? row.original.categoriaCodigo,
      },
      {
        id: 'actions',
        header: '',
        meta: { isActionColumn: true },
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ActionButtonsList<FormRowAction, ObraMusicalReferenciaItem>
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
                  'referencias',
                  referencias.filter((_, i) => i !== row.index),
                  { shouldDirty: true },
                )
              }}
            />
          </div>
        ),
      },
    ],
    [form, referencias, categoriaMap],
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
        Nova referência
      </Button>
      <DataTable columns={columns} data={referencias} />
      <ObraMusicalReferenciaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialValue={editingIndex != null ? referencias[editingIndex] : undefined}
        onSave={(item) => {
          if (editingIndex != null) {
            const next = [...referencias]
            next[editingIndex] = item
            form.setValue('referencias', next, { shouldDirty: true })
          } else {
            form.setValue('referencias', [...referencias, item], { shouldDirty: true })
          }
          setEditingIndex(null)
        }}
      />
    </div>
  )
}
