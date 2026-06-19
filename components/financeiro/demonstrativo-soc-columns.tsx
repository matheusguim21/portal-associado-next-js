import type { ColumnDef } from '@tanstack/react-table'
import type { DemonstrativoSocApi } from '@/types/api/documentacao'

export const demonstrativoSocColumns: ColumnDef<DemonstrativoSocApi>[] = [
  { accessorKey: 'periodo', header: 'Período', meta: { mobilePrimary: true } },
  { accessorKey: 'dataPagamento', header: 'Data pagamento' },
  {
    accessorKey: 'valor',
    header: 'Valor',
    cell: ({ row }) =>
      row.original.valor != null
        ? row.original.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : '—',
  },
]
