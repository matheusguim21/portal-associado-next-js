import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoveDown, MoveUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SortParam } from '@/types/api/search'

export type CreateSortableColumnOptions<T> = Partial<ColumnDef<T>> & {
  sortHeaderDisabled?: boolean
}

export function createSortableColumn<T>(
  field: keyof T | string,
  label: string,
  sortParam: SortParam | null,
  onSort: (columnId: string) => void,
  formatCell?: (value: unknown) => string,
  options?: CreateSortableColumnOptions<T>,
): ColumnDef<T> {
  const { sortHeaderDisabled, ...columnRest } = options ?? {}

  return {
    accessorKey: String(field),
    header: ({ column }) => {
      const isActive = sortParam?.startsWith(column.id + ',')
      const isDescending = isActive && sortParam?.endsWith(',desc')

      return (
        <Button
          type="button"
          variant="ghost"
          disabled={sortHeaderDisabled}
          className={cn(
            'h-auto justify-start gap-2 p-0 font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground',
            isActive && 'text-foreground',
            sortHeaderDisabled && 'pointer-events-none opacity-50',
          )}
          onClick={() => {
            if (!sortHeaderDisabled) onSort(column.id)
          }}
        >
          {label}
          {isActive ? (
            isDescending ? (
              <MoveDown size={14} className="shrink-0 opacity-70" />
            ) : (
              <MoveUp size={14} className="shrink-0 opacity-70" />
            )
          ) : (
            <ArrowUpDown size={16} className="shrink-0 opacity-50" />
          )}
        </Button>
      )
    },
    cell: formatCell
      ? ({ row }) => {
          const value = row.getValue(String(field))
          return <span>{formatCell(value)}</span>
        }
      : ({ row }) => {
          const value = row.getValue(String(field))
          return <span>{value != null ? String(value) : '—'}</span>
        },
    ...columnRest,
  }
}
