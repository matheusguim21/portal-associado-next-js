'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import {
  demonstrativoEcadActionsConfig,
  type DemonstrativoEcadAction,
} from '@/lib/table-actions/demonstrativo-ecad-action-config'
import type { DemonstrativoEcadApi } from '@/types/api/documentacao'

export const demonstrativoEcadColumns: ColumnDef<DemonstrativoEcadApi>[] = [
  { accessorKey: 'periodo', header: 'Período' },
  { accessorKey: 'grupo', header: 'Grupo' },
  { accessorKey: 'nomeArquivo', header: 'Arquivo', meta: { mobilePrimary: true } },
]

export function createDemonstrativoEcadDownloadColumn(
  onDownload: (item: DemonstrativoEcadApi) => void,
): ColumnDef<DemonstrativoEcadApi> {
  return {
    id: 'acoes',
    header: 'Ações',
    meta: { isActionColumn: true },
    cell: ({ row }) => (
      <ActionButtonsList<DemonstrativoEcadAction, DemonstrativoEcadApi>
        actionsConfig={demonstrativoEcadActionsConfig}
        actionsToShow={['download']}
        item={row.original}
        onAction={(action, item) => {
          if (action === 'download') onDownload(item)
        }}
      />
    ),
  }
}
