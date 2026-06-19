import type { ColumnDef } from '@tanstack/react-table'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import { RetidoCellText } from '@/components/documentacao/retido/RetidoCellText'
import {
  formatRetidoCompet,
  retidoCommonTrailingColumns,
  retidoPlainTextColumn,
  retidoSelectColumn,
  retidoSortableTextColumn,
  withRetidoMeta,
} from '@/components/documentacao/retido/retido-columns-shared'
import { RETIDO_UI_LABELS } from '@/lib/retido-labels'
import { pkCodigoToString } from '@/lib/retido-pesquisa'
import { retidoActionsConfig, type RetidoAction } from '@/lib/table-actions/retido-action-config'
import type { RetConModel } from '@/types/api/documentacao/retido'
import type { SortParam } from '@/types/api/search'

export function createRetidoConexoColumns(
  onOpenDetail: (row: RetConModel) => void,
  sortParam: SortParam | null,
  onSort: (columnId: string) => void,
  sortHeaderDisabled?: boolean,
): ColumnDef<RetConModel>[] {
  const sortOpts = { sortHeaderDisabled, enableSorting: false as const }
  const labels = RETIDO_UI_LABELS.columns

  return [
    retidoSelectColumn<RetConModel>(),
    retidoSortableTextColumn(
      'compet',
      labels.compet,
      sortParam,
      onSort,
      sortOpts,
      'compet',
      { formatCell: formatRetidoCompet },
    ),
    retidoSortableTextColumn('rubrica', labels.rubrica, sortParam, onSort, sortOpts, 'rubrica'),
    retidoSortableTextColumn<RetConModel>(
      'pkCodigo',
      labels.pkCodigo,
      sortParam,
      onSort,
      {
        ...sortOpts,
        cell: ({ row }) => (
          <RetidoCellText nowrap value={pkCodigoToString(row.original.pkCodigo)} />
        ),
      },
      'pk',
    ),
    withRetidoMeta(
      retidoSortableTextColumn('nmObra', labels.nmObra, sortParam, onSort, sortOpts, 'wrap'),
      { mobilePrimary: true },
    ),
    retidoPlainTextColumn<RetConModel>('refGravadora', labels.refGravadora, 'wrap'),
    ...retidoCommonTrailingColumns<RetConModel>(sortParam, onSort, sortOpts),
    withRetidoMeta<RetConModel>(
      {
        id: 'actions',
        header: () => (
          <span className="sr-only sm:not-sr-only sm:inline">{labels.actions}</span>
        ),
        cell: ({ row }) => (
          <ActionButtonsList<RetidoAction, RetConModel>
            actionsConfig={retidoActionsConfig}
            actionsToShow={['viewDetail']}
            item={row.original}
            onAction={(action, item) => {
              if (action === 'viewDetail') onOpenDetail(item)
            }}
          />
        ),
        enableSorting: false,
      },
      { isActionColumn: true },
      'actions',
    ),
  ]
}
