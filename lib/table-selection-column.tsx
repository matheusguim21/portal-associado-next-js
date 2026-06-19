import type { ColumnDef, Row, Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

export interface TableSelectionActions<TItem, TId extends string | number> {
  isSelected: (id: TId) => boolean
  toggleItem: (item: TItem) => void
  addItemIfMissing: (item: TItem) => void
  removeItem: (id: TId) => void
}

export type CreateSelectCheckboxColumnOptions<
  TRow,
  TItem,
  TId extends string | number,
> = {
  getItemId: (item: TItem) => TId
  rowToItem: (row: TRow) => TItem
  useSelection: () => TableSelectionActions<TItem, TId>
  selectAllAriaLabel?: string
  selectRowAriaLabel?: string
}

export function createSelectCheckboxColumn<
  TRow,
  TItem,
  TId extends string | number,
>({
  getItemId,
  rowToItem,
  useSelection,
  selectAllAriaLabel = 'Selecionar todos',
  selectRowAriaLabel = 'Selecionar linha',
}: CreateSelectCheckboxColumnOptions<TRow, TItem, TId>): ColumnDef<TRow> {
  function SelectHeader({ table }: { table: Table<TRow> }) {
    const { isSelected, addItemIfMissing, removeItem } = useSelection()
    const currentPageRows = table.getRowModel().rows
    const currentPageIds = currentPageRows.map((row) => getItemId(rowToItem(row.original)))
    const selectedOnPage = currentPageIds.filter((id) => isSelected(id))
    const isAllSelected =
      currentPageIds.length > 0 && selectedOnPage.length === currentPageIds.length

    return (
      <input
        type="checkbox"
        checked={isAllSelected}
        onChange={(e) => {
          if (e.target.checked) {
            currentPageRows.forEach((row) => addItemIfMissing(rowToItem(row.original)))
          } else {
            currentPageIds.forEach((id) => removeItem(id))
          }
        }}
        aria-label={selectAllAriaLabel}
        className={cn('size-4 rounded border border-input accent-primary')}
      />
    )
  }

  function SelectCell({ row }: { row: Row<TRow> }) {
    const { toggleItem, isSelected } = useSelection()
    const item = rowToItem(row.original)
    const id = getItemId(item)

    return (
      <input
        type="checkbox"
        checked={isSelected(id)}
        onChange={() => toggleItem(item)}
        aria-label={selectRowAriaLabel}
        className={cn('size-4 rounded border border-input accent-primary')}
      />
    )
  }

  return {
    id: 'select',
    header: ({ table }) => <SelectHeader table={table} />,
    cell: ({ row }) => <SelectCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  }
}
