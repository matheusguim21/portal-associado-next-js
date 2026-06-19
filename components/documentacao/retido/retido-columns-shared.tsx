import type { ColumnDef } from '@tanstack/react-table'
import { RetidoSituacaoCell } from '@/components/data-table/column-cells'
import { RetidoCellText } from '@/components/documentacao/retido/RetidoCellText'
import { useRetidoTableSelection } from '@/hooks/use-retido-table-selection'
import { createSelectCheckboxColumn } from '@/lib/table-selection-column'
import {
  createSortableColumn,
  type CreateSortableColumnOptions,
} from '@/lib/retido-table-utils'
import { RETIDO_UI_LABELS } from '@/lib/retido-labels'
import { pkCodigoToString } from '@/lib/retido-pesquisa'
import { cn } from '@/lib/utils'
import type { RetidoSelecionado } from '@/stores/use-retido-selecao-store'
import type { SortParam } from '@/types/api/search'

export type RetidoColumnMeta = {
  className?: string
  isActionColumn?: boolean
  mobilePrimary?: boolean
  mobileHidden?: boolean
}

export const RETIDO_COL = {
  select: { size: 44, minSize: 44, maxSize: 44 },
  pk: { size: 100, minSize: 100, maxSize: 120 },
  compet: { size: 100, minSize: 100, maxSize: 120 },
  rubrica: { size: 100, minSize: 100, maxSize: 120 },
  short: { size: 96, minSize: 72, maxSize: 140 },
  medium: { size: 120, minSize: 88, maxSize: 200 },
  long: { size: 140, minSize: 100, maxSize: 240 },
  wrap: { size: 130, minSize: 90 },
  actions: { size: 52, minSize: 52, maxSize: 52 },
} as const

export function formatRetidoCompet(value: unknown): string {
  if (value == null || value === '') return ''
  const raw = String(value).trim()
  if (/^\d{6}$/.test(raw)) return `${raw.slice(0, 2)}/${raw.slice(2)}`
  return raw
}

type RetidoSelectableRow = {
  pkCodigo?: unknown
  nmObra?: string | null
  compet?: string | null
}

export function retidoRowToSelecionado(row: RetidoSelectableRow): RetidoSelecionado {
  return {
    pkCodigo: pkCodigoToString(row.pkCodigo as string | number),
    nmObra: row.nmObra ?? null,
    compet: row.compet ?? null,
  }
}

export function retidoSelectColumn<T extends RetidoSelectableRow>(): ColumnDef<T> {
  return {
    ...createSelectCheckboxColumn<T, RetidoSelecionado, string>({
      getItemId: (item) => item.pkCodigo,
      rowToItem: retidoRowToSelecionado,
      useSelection: useRetidoTableSelection,
      selectAllAriaLabel: RETIDO_UI_LABELS.selectAll,
      selectRowAriaLabel: RETIDO_UI_LABELS.selectRow,
    }),
    ...RETIDO_COL.select,
  }
}

export function withRetidoMeta<T>(
  column: ColumnDef<T>,
  meta: RetidoColumnMeta,
  sizeKey?: keyof typeof RETIDO_COL,
): ColumnDef<T> {
  return {
    ...column,
    ...(sizeKey ? RETIDO_COL[sizeKey] : {}),
    meta: {
      ...(column.meta as RetidoColumnMeta | undefined),
      ...meta,
    },
  }
}

type RetidoBreakpoint = 'md' | 'lg' | 'xl'

function hiddenFromClass(bp?: RetidoBreakpoint) {
  if (!bp) return undefined
  return `hidden ${bp}:table-cell`
}

export function retidoSortableTextColumn<T>(
  field: keyof T | string,
  label: string,
  sortParam: SortParam | null,
  onSort: (columnId: string) => void,
  sortOpts: CreateSortableColumnOptions<T>,
  width: keyof typeof RETIDO_COL,
  options?: {
    hiddenFrom?: RetidoBreakpoint
    formatCell?: (value: unknown) => string
  },
): ColumnDef<T> {
  const fieldKey = String(field)
  const { cell: customCell, meta: sortMeta, ...restSortOpts } = sortOpts
  return {
    ...createSortableColumn(
      field,
      label,
      sortParam,
      onSort,
      options?.formatCell,
      {
        ...restSortOpts,
        ...RETIDO_COL[width],
        meta: {
          ...(sortMeta as RetidoColumnMeta | undefined),
          className: cn(
            hiddenFromClass(options?.hiddenFrom),
            (sortMeta as RetidoColumnMeta | undefined)?.className,
          ),
        },
        cell:
          customCell ??
          (({ row }) => (
            <RetidoCellText
              value={
                options?.formatCell
                  ? options.formatCell(row.getValue(fieldKey))
                  : row.getValue(fieldKey)
              }
            />
          )),
      },
    ),
  }
}

export function retidoPlainTextColumn<T>(
  accessorKey: keyof T & string,
  header: string,
  width: keyof typeof RETIDO_COL,
  hiddenFrom?: RetidoBreakpoint,
): ColumnDef<T> {
  return {
    accessorKey,
    header,
    ...RETIDO_COL[width],
    meta: { className: hiddenFromClass(hiddenFrom) },
    cell: ({ row }) => (
      <RetidoCellText value={(row.original as Record<string, unknown>)[accessorKey]} />
    ),
  }
}

type RetidoRowExtras = {
  nmAudio?: string | null
  nroOcor?: string | number | null
  refAutoral?: string | null
  refInterprete?: string | null
  dscPlano?: string | null
  situacao?: string | null
  motivoRetencao?: string | null
}

export function retidoCommonTrailingColumns<T extends RetidoRowExtras>(
  sortParam: SortParam | null,
  onSort: (columnId: string) => void,
  sortOpts: CreateSortableColumnOptions<T>,
): ColumnDef<T>[] {
  const labels = RETIDO_UI_LABELS.columns
  return [
    retidoPlainTextColumn<T>('nroOcor', labels.nroOcor, 'short'),
    retidoSortableTextColumn<T>(
      'refAutoral',
      labels.refAutoral,
      sortParam,
      onSort,
      sortOpts,
      'wrap',
    ),
    retidoSortableTextColumn<T>(
      'refInterprete',
      labels.refInterprete,
      sortParam,
      onSort,
      sortOpts,
      'wrap',
    ),
    {
      accessorKey: 'situacao',
      header: labels.situacao,
      ...RETIDO_COL.short,
      cell: ({ row }) => <RetidoSituacaoCell situacao={row.original.situacao} />,
    },
    retidoPlainTextColumn<T>('motivoRetencao', labels.motivoRetencao, 'wrap'),
  ]
}
