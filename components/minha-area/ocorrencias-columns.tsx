import type { ColumnDef } from '@tanstack/react-table'
import {
  ArquivoRepertorioStatusCell,
  ArquivoRepertorioTipoCell,
} from '@/components/data-table/column-cells'
import type { ArquivoRepertorioApi } from '@/types/api/documentacao'

export const minhaAreaOcorrenciasColumns: ColumnDef<ArquivoRepertorioApi>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'nomeArquivo', header: 'Arquivo', meta: { mobilePrimary: true } },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => <ArquivoRepertorioTipoCell tipo={row.original.tipo} />,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ArquivoRepertorioStatusCell status={row.original.status} />,
  },
  { accessorKey: 'dataGeracao', header: 'Data' },
]
