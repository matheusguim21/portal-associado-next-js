'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { MonoCell, SituacaoCell } from '@/components/data-table/column-cells'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import {
  fonogramaActionsConfig,
  type FonogramaAction,
} from '@/lib/table-actions/fonograma-action-config'
import type { FonogramaApi } from '@/types/api/documentacao'
import { formatIsrc } from '@/lib/masks'

export function getFonogramaTitulo(fonograma: FonogramaApi): string {
  return fonograma.obraMusical?.titulo ?? fonograma.poutPourrit?.titulo ?? fonograma.titulo ?? '—'
}

const fonogramaTituloColumn: ColumnDef<FonogramaApi> = {
  id: 'titulo',
  header: 'Título',
  meta: { mobilePrimary: true },
  cell: ({ row }) => getFonogramaTitulo(row.original),
}

export const fonogramaConsultaColumns: ColumnDef<FonogramaApi>[] = [
  {
    accessorKey: 'id',
    header: 'Cód. SOC',
    cell: ({ row }) => <MonoCell value={row.original.id} />,
  },
  fonogramaTituloColumn,
  {
    accessorKey: 'codigoEcad',
    header: 'Cód. ECAD',
    cell: ({ row }) => <MonoCell value={row.original.codigoEcad} />,
  },
  {
    accessorKey: 'isrc',
    header: 'ISRC',
    cell: ({ row }) => <MonoCell value={formatIsrc(row.original.isrc ?? '')} />,
  },
  {
    accessorKey: 'gra',
    header: 'GRA',
    cell: ({ row }) => <MonoCell value={row.original.gra} />,
  },
  {
    id: 'situacao',
    header: 'Situação',
    cell: ({ row }) => (
      <SituacaoCell situacaoCadastral={row.original.situacaoCadastral} />
    ),
  },
]

export const fonogramaMinhaAreaColumns: ColumnDef<FonogramaApi>[] = [
  { accessorKey: 'id', header: 'Código' },
  fonogramaTituloColumn,
  { accessorKey: 'isrc', header: 'ISRC' },
  {
    id: 'situacao',
    header: 'Situação',
    cell: ({ row }) => <SituacaoCell situacaoCadastral={row.original.situacaoCadastral} />,
  },
]

export const fonogramaCadastroColumns: ColumnDef<FonogramaApi>[] = [
  { accessorKey: 'id', header: 'Código' },
  fonogramaTituloColumn,
  { accessorKey: 'isrc', header: 'ISRC' },
  {
    id: 'situacao',
    header: 'Situação',
    cell: ({ row }) => <SituacaoCell situacaoCadastral={row.original.situacaoCadastral} />,
  },
]

export function createFonogramaVerColumn(
  onView: (fonograma: FonogramaApi) => void,
): ColumnDef<FonogramaApi> {
  return {
    id: 'acoes',
    header: () => <span className="sr-only">Ações</span>,
    meta: { isActionColumn: true },
    cell: ({ row }) => (
      <ActionButtonsList<FonogramaAction, FonogramaApi>
        actionsConfig={fonogramaActionsConfig}
        actionsToShow={['view']}
        item={row.original}
        onAction={(action, fonograma) => {
          if (action === 'view') onView(fonograma)
        }}
      />
    ),
  }
}
