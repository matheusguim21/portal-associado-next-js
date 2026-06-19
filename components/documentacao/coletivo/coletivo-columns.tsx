import type { ColumnDef } from '@tanstack/react-table'
import type { ColetivoApi } from '@/types/api/documentacao'

export const coletivoCadastroColumns: ColumnDef<ColetivoApi>[] = [
  { accessorKey: 'id', header: 'Código' },
  { accessorKey: 'nome', header: 'Nome', meta: { mobilePrimary: true } },
  { accessorKey: 'codEcad', header: 'ECAD' },
]
