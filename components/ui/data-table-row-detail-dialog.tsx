'use client'

import { flexRender, type ColumnDef, type Row } from '@tanstack/react-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  getColumnHeaderLabel,
  getColumnId,
  getRowCell,
  isActionColumn,
  partitionColumnsForMobile,
} from '@/components/ui/data-table-column-meta'

interface DataTableRowDetailDialogProps<TData> {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: Row<TData> | null
  columns: ColumnDef<TData>[]
  title?: string
}

function getPrimaryCellValue<TData>(
  row: Row<TData>,
  columns: ColumnDef<TData>[],
): string | null {
  const { primary } = partitionColumnsForMobile(columns)
  if (!primary) return null

  const cell = getRowCell(row, primary)
  if (!cell) return null

  const rendered = flexRender(cell.column.columnDef.cell, cell.getContext())
  if (rendered == null || rendered === false) return null
  if (typeof rendered === 'string' || typeof rendered === 'number') return String(rendered)

  return null
}

export function DataTableRowDetailDialog<TData>({
  open,
  onOpenChange,
  row,
  columns,
  title,
}: DataTableRowDetailDialogProps<TData>) {
  const detailColumns = columns.filter((column) => !isActionColumn(column))
  const dialogTitle =
    title ??
    (row ? getPrimaryCellValue(row, columns) : null) ??
    'Detalhes'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        {row && (
          <dl className="grid gap-4 sm:grid-cols-2">
            {detailColumns.map((column) => {
              const columnId = getColumnId(column)
              if (!columnId) return null

              const cell = getRowCell(row, column)

              return (
                <div key={columnId} className="min-w-0 space-y-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {getColumnHeaderLabel(column)}
                  </dt>
                  <dd className="text-sm break-words">
                    {cell
                      ? flexRender(cell.column.columnDef.cell, cell.getContext())
                      : '—'}
                  </dd>
                </div>
              )
            })}
          </dl>
        )}
      </DialogContent>
    </Dialog>
  )
}
