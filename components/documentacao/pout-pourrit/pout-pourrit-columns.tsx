'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import {
  poutPourritActionsConfig,
  type PoutPourritAction,
} from '@/lib/table-actions/pout-pourrit-action-config'
import type { PoutPourritApi } from '@/types/api/documentacao'

export const poutPourritCadastroColumns: ColumnDef<PoutPourritApi>[] = [
  { accessorKey: 'id', header: 'Código' },
  { accessorKey: 'titulo', header: 'Título', meta: { mobilePrimary: true } },
  { accessorKey: 'iswc', header: 'ISWC' },
]

export const poutPourritSearchModalColumns: ColumnDef<PoutPourritApi>[] = [
  { accessorKey: 'id', header: 'Cód. SOC' },
  { accessorKey: 'codEcad', header: 'Cód. ECAD' },
  { accessorKey: 'titulo', header: 'Título', meta: { mobilePrimary: true } },
]

export function createPoutPourritSelectColumn(
  onSelect: (pout: PoutPourritApi) => void,
  onClose?: () => void,
): ColumnDef<PoutPourritApi> {
  return {
    id: 'acoes',
    header: '',
    meta: { isActionColumn: true },
    cell: ({ row }) => (
      <ActionButtonsList<PoutPourritAction, PoutPourritApi>
        actionsConfig={poutPourritActionsConfig}
        actionsToShow={['select']}
        item={row.original}
        onAction={(action, pout) => {
          if (action === 'select') {
            onSelect(pout)
            onClose?.()
          }
        }}
      />
    ),
  }
}
