import type { Cell, ColumnDef, Row } from '@tanstack/react-table'

export type DataTableColumnMeta = {
  className?: string
  /** Coluna de ações — renderizada no footer do card, omitida do modal de detalhes */
  isActionColumn?: boolean
  /** Título principal do card */
  mobilePrimary?: boolean
  /** Oculta do resumo do card (ainda aparece no modal) */
  mobileHidden?: boolean
}

const ACTION_COLUMN_IDS = new Set(['acoes', 'actions', 'select'])

export function getColumnMeta<TData>(
  column: ColumnDef<TData>,
): DataTableColumnMeta | undefined {
  return column.meta as DataTableColumnMeta | undefined
}

export function isActionColumn<TData>(column: ColumnDef<TData>): boolean {
  const meta = getColumnMeta(column)
  if (meta?.isActionColumn) return true

  const id = column.id ?? ''
  if (ACTION_COLUMN_IDS.has(id)) return true

  const accessorKey =
    'accessorKey' in column && typeof column.accessorKey === 'string'
      ? column.accessorKey
      : undefined

  return accessorKey != null && ACTION_COLUMN_IDS.has(accessorKey)
}

export function getColumnId<TData>(column: ColumnDef<TData>): string | undefined {
  if (column.id) return column.id

  if ('accessorKey' in column && typeof column.accessorKey === 'string') {
    return column.accessorKey
  }

  return undefined
}

export function getRowCell<TData>(
  row: Row<TData>,
  column: ColumnDef<TData>,
): Cell<TData, unknown> | undefined {
  const columnId = getColumnId(column)
  if (!columnId) return undefined

  return row.getVisibleCells().find((cell) => cell.column.id === columnId)
}

export function getColumnHeaderLabel<TData>(column: ColumnDef<TData>): string {
  const { header } = column

  if (typeof header === 'string') return header

  const accessorKey =
    'accessorKey' in column && typeof column.accessorKey === 'string'
      ? column.accessorKey
      : undefined

  if (column.id) return column.id
  if (accessorKey) return accessorKey

  return 'Campo'
}

function isPrimaryCandidate<TData>(column: ColumnDef<TData>): boolean {
  if (isActionColumn(column)) return false

  const meta = getColumnMeta(column)
  if (meta?.mobilePrimary) return true

  const accessorKey =
    'accessorKey' in column && typeof column.accessorKey === 'string'
      ? column.accessorKey
      : undefined

  if (accessorKey === 'titulo') return true

  const headerLabel = getColumnHeaderLabel(column).toLowerCase()
  return headerLabel === 'título' || headerLabel === 'titulo'
}

function isDataColumn<TData>(column: ColumnDef<TData>): boolean {
  if (isActionColumn(column)) return false

  const meta = getColumnMeta(column)
  return !meta?.mobileHidden
}

export type MobileColumnPartition<TData> = {
  primary: ColumnDef<TData> | null
  summary: ColumnDef<TData>[]
  detail: ColumnDef<TData>[]
  actions: ColumnDef<TData>[]
  detailModal: ColumnDef<TData>[]
}

export function partitionColumnsForMobile<TData>(
  columns: ColumnDef<TData>[],
): MobileColumnPartition<TData> {
  const actions = columns.filter(isActionColumn)
  const dataColumns = columns.filter((column) => !isActionColumn(column))

  const primary =
    dataColumns.find((column) => getColumnMeta(column)?.mobilePrimary) ??
    dataColumns.find(isPrimaryCandidate) ??
    dataColumns[0] ??
    null

  const remainingData = dataColumns.filter((column) => column !== primary)
  const summaryCandidates = remainingData.filter(isDataColumn)
  const summary = summaryCandidates.slice(0, 3)
  const summarySet = new Set(summary)

  const detail = remainingData.filter(
    (column) => !summarySet.has(column) && isDataColumn(column),
  )

  const detailModal = dataColumns.filter((column) => !isActionColumn(column))

  return {
    primary,
    summary,
    detail,
    actions,
    detailModal,
  }
}
