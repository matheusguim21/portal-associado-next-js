import type { ColumnDef } from '@tanstack/react-table'

export type RetidoRow = Record<string, unknown>

export const retidoConsultaColumns: ColumnDef<RetidoRow>[] = [
  { accessorKey: 'titulo', header: 'Título' },
  { accessorKey: 'codigoEcad', header: 'Código ECAD' },
  { accessorKey: 'valor', header: 'Valor' },
]
