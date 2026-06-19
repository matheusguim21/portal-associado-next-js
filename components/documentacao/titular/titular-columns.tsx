'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import {
  titularActionsConfig,
  type TitularAction,
} from '@/lib/table-actions/titular-action-config'
import type { TitularApi } from '@/types/api/documentacao'

export const titularSearchColumns: ColumnDef<TitularApi>[] = [
  { accessorKey: 'id', header: 'Cód. SOC' },
  { accessorKey: 'codigoEcad', header: 'Cód. ECAD' },
  { accessorKey: 'nome', header: 'Nome', meta: { mobilePrimary: true } },
]

export function createTitularSelectColumn(
  onSelect: (titular: TitularApi) => void,
  onClose?: () => void,
): ColumnDef<TitularApi> {
  return {
    id: 'acoes',
    header: '',
    meta: { isActionColumn: true },
    cell: ({ row }) => (
      <ActionButtonsList<TitularAction, TitularApi>
        actionsConfig={titularActionsConfig}
        actionsToShow={['select']}
        item={row.original}
        onAction={(action, titular) => {
          if (action === 'select') {
            onSelect(titular)
            onClose?.()
          }
        }}
      />
    ),
  }
}
