import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { RETIDO_UI_LABELS } from '@/lib/retido-labels'
import type { RetidoDetailRow } from '@/components/documentacao/retido/retido-detail-rows'

interface RetidoDetailTableProps {
  rows: RetidoDetailRow[]
}

export function RetidoDetailTable({ rows }: RetidoDetailTableProps) {
  const labels = RETIDO_UI_LABELS.detailModal

  const columns = useMemo<ColumnDef<RetidoDetailRow>[]>(
    () => [
      {
        accessorKey: 'label',
        header: labels.tableField,
        cell: ({ row }) => (
          <span className="text-muted-foreground font-medium">{row.original.label}</span>
        ),
      },
      {
        accessorKey: 'value',
        header: labels.tableValue,
        cell: ({ row }) => (
          <span className="break-words font-medium">{row.original.value}</span>
        ),
      },
    ],
    [labels.tableField, labels.tableValue],
  )

  return <DataTable columns={columns} data={rows} mobileCards={false} />
}
