'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { MonoCell, SituacaoCell, DerivadaCell } from '@/components/data-table/column-cells'
import { ObraMusicalGerarOcorrenciaButton } from '@/components/documentacao/obra-musical/ObraMusicalGerarOcorrenciaButton'
import { ActionButtonsList } from '@/components/ui/action-buttons-list'
import { getArquivoRepertorioStatusLabel } from '@/lib/enum-labels'
import {
  obraMusicalActionsConfig,
  obraMusicalCadastroActionsConfig,
  type ObraMusicalAction,
} from '@/lib/table-actions/obra-musical-action-config'
import type { ObraMusicalApi } from '@/types/api/documentacao'

export const obraMusicalConsultaColumns: ColumnDef<ObraMusicalApi>[] = [
  {
    accessorKey: 'id',
    header: 'Código SOC',
    cell: ({ row }) => <MonoCell value={row.original.id} />,
  },
  { accessorKey: 'titulo', header: 'Título', meta: { mobilePrimary: true } },
  {
    accessorKey: 'derivada',
    header: 'Tipo',
    cell: ({ row }) => <DerivadaCell derivada={row.original.derivada} />,
  },
  {
    id: 'situacao',
    header: 'Situação',
    cell: ({ row }) => (
      <SituacaoCell situacaoCadastral={row.original.situacaoCadastral} />
    ),
  },
  {
    accessorKey: 'codigoEcad',
    header: 'Código ECAD',
    cell: ({ row }) => <MonoCell value={row.original.codigoEcad} />,
  },
  {
    accessorKey: 'iswc',
    header: 'ISWC',
    cell: ({ row }) => <MonoCell value={row.original.iswc} />,
  },
]

export const obraMusicalMinhaAreaColumns: ColumnDef<ObraMusicalApi>[] = [
  {
    accessorKey: 'id',
    header: 'Código SOC',
    cell: ({ row }) => <MonoCell value={row.original.id} />,
  },
  { accessorKey: 'titulo', header: 'Título', meta: { mobilePrimary: true } },
  {
    id: 'situacao',
    header: 'Situação',
    cell: ({ row }) => <SituacaoCell situacaoCadastral={row.original.situacaoCadastral} />,
  },
  {
    accessorKey: 'codigoEcad',
    header: 'ECAD',
    cell: ({ row }) => row.original.codigoEcad ?? '—',
  },
]

export const obraMusicalCadastroColumns: ColumnDef<ObraMusicalApi>[] = [
  { accessorKey: 'id', header: 'Código' },
  { accessorKey: 'titulo', header: 'Título', meta: { mobilePrimary: true } },
  {
    id: 'situacao',
    header: 'Situação',
    cell: ({ row }) => <SituacaoCell situacaoCadastral={row.original.situacaoCadastral} />,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => getArquivoRepertorioStatusLabel(row.original.status),
  },
]

export const obraMusicalSearchModalColumns: ColumnDef<ObraMusicalApi>[] = [
  { accessorKey: 'id', header: 'Cód. SOC' },
  { accessorKey: 'codigoEcad', header: 'Cód. ECAD' },
  { accessorKey: 'titulo', header: 'Título', meta: { mobilePrimary: true } },
]

export function createObraMusicalVerColumn(
  onView: (obra: ObraMusicalApi) => void,
): ColumnDef<ObraMusicalApi> {
  return {
    id: 'acoes',
    header: () => <span className="sr-only">Ações</span>,
    meta: { isActionColumn: true },
    cell: ({ row }) => (
      <ActionButtonsList<ObraMusicalAction, ObraMusicalApi>
        actionsConfig={obraMusicalActionsConfig}
        actionsToShow={['view']}
        item={row.original}
        onAction={(action, obra) => {
          if (action === 'view') onView(obra)
        }}
      />
    ),
  }
}

export function createObraMusicalCadastroAcoesColumn(options?: {
  onGerarOcorrenciaSuccess?: () => void
}): ColumnDef<ObraMusicalApi> {
  return {
    id: 'acoes',
    header: 'Ações',
    meta: { isActionColumn: true },
    cell: ({ row }) => {
      const obra = row.original
      const actionsToShow: ObraMusicalAction[] =
        obra.status === 'CAD_TITULAR' ? ['view', 'edit'] : ['view']

      return (
        <div className="flex items-center gap-2">
          <ActionButtonsList<ObraMusicalAction, ObraMusicalApi>
            actionsConfig={obraMusicalCadastroActionsConfig}
            actionsToShow={actionsToShow}
            item={obra}
            disabledContext={{ status: obra.status }}
            onAction={() => {}}
          />
          <ObraMusicalGerarOcorrenciaButton
            obra={obra}
            display="icon"
            onSuccess={options?.onGerarOcorrenciaSuccess}
          />
        </div>
      )
    },
  }
}

export function createObraMusicalSelectColumn(
  onSelect: (obra: ObraMusicalApi) => void,
): ColumnDef<ObraMusicalApi> {
  return {
    id: 'acoes',
    header: '',
    meta: { isActionColumn: true },
    cell: ({ row }) => (
      <ActionButtonsList<ObraMusicalAction, ObraMusicalApi>
        actionsConfig={obraMusicalActionsConfig}
        actionsToShow={['select']}
        item={row.original}
        onAction={(action, obra) => {
          if (action === 'select') onSelect(obra)
        }}
      />
    ),
  }
}
