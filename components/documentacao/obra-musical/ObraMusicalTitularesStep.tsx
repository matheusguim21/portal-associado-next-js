'use client'

import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { ObraMusicalTitularModal } from '@/components/documentacao/obra-musical/ObraMusicalTitularModal'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  formRowActionsConfig,
  type FormRowAction,
} from '@/lib/table-actions/form-row-action-config'
import type {
  CreateObraMusicalFormData,
  ObraMusicalTitularItem,
} from '@/schemas/create-obra-musical-schema'

type ObraMusicalTitularesStepProps = {
  form: UseFormReturn<CreateObraMusicalFormData>
}

export function ObraMusicalTitularesStep({ form }: ObraMusicalTitularesStepProps) {
  const titulares = form.watch('titulares')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const totalPercentual = useMemo(
    () => titulares.reduce((sum, item) => sum + (item.percentual ?? 0), 0),
    [titulares],
  )

  const columns = useMemo<ColumnDef<ObraMusicalTitularItem>[]>(
    () => [
      { id: 'titular', header: 'Titular', meta: { mobilePrimary: true }, cell: ({ row }) => row.original.titularNome ?? '—' },
      { id: 'soc', header: 'Cód. SOC', cell: ({ row }) => row.original.titularId ?? '—' },
      { id: 'ecad', header: 'Cód. ECAD', cell: ({ row }) => row.original.codigoEcad ?? '—' },
      {
        id: 'subcategoria',
        header: 'Subcategoria',
        cell: ({ row }) => row.original.subcategoriaCodigo ?? '—',
      },
      {
        id: 'percentual',
        header: 'Percentual',
        cell: ({ row }) =>
          row.original.percentual != null ? `${row.original.percentual.toFixed(2)}%` : '—',
      },
      {
        id: 'actions',
        header: '',
        meta: { isActionColumn: true },
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ActionButtonsList<FormRowAction, ObraMusicalTitularItem>
              actionsConfig={formRowActionsConfig}
              actionsToShow={['edit', 'delete']}
              item={row.original}
              onAction={(action) => {
                if (action === 'edit') {
                  setEditingIndex(row.index)
                  setModalOpen(true)
                  return
                }
                const next = titulares.filter((_, i) => i !== row.index)
                form.setValue('titulares', next, { shouldDirty: true })
              }}
            />
          </div>
        ),
      },
    ],
    [form, titulares],
  )

  function handleSave(item: ObraMusicalTitularItem) {
    if (editingIndex != null) {
      const next = [...titulares]
      next[editingIndex] = item
      form.setValue('titulares', next, { shouldDirty: true })
    } else {
      form.setValue('titulares', [...titulares, item], { shouldDirty: true })
    }
    setEditingIndex(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => {
              setEditingIndex(null)
              setModalOpen(true)
            }}
          >
            <Plus className="size-4" data-icon="inline-start" />
            Novo titular
          </Button>
          <Badge variant={Math.abs(totalPercentual - 100) < 0.01 ? 'default' : 'destructive'}>
            Total: {totalPercentual.toFixed(2)}%
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Se nenhum titular for informado, o sistema incluirá automaticamente o titular da sessão.
        </p>
      </div>

      <DataTable columns={columns} data={titulares} />

      <ObraMusicalTitularModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialValue={editingIndex != null ? titulares[editingIndex] : undefined}
        onSave={handleSave}
      />
    </div>
  )
}
