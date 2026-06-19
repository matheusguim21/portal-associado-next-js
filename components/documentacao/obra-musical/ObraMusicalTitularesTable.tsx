'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import type { ObraMusicalTitularApi } from '@/types/api/documentacao'

const columns: ColumnDef<ObraMusicalTitularApi>[] = [
  {
    id: 'titular',
    header: 'Titular',
    cell: ({ row }) => row.original.titular?.nome ?? '—',
  },
  {
    id: 'codigoSoc',
    header: 'Cód. SOC',
    cell: ({ row }) => row.original.titular?.id ?? '—',
  },
  {
    id: 'codigoEcad',
    header: 'Cód. ECAD',
    cell: ({ row }) => row.original.titular?.codigoEcad ?? '—',
  },
  {
    id: 'subcategoria',
    header: 'Subcategoria',
    cell: ({ row }) => row.original.subCategoria?.descricao ?? '—',
  },
  {
    id: 'dtInicio',
    header: 'Início',
    cell: ({ row }) => row.original.dtInicio ?? '—',
  },
  {
    id: 'dtFim',
    header: 'Fim',
    cell: ({ row }) => row.original.dtFim ?? '—',
  },
]

type ObraMusicalTitularesTableProps = {
  titulares?: ObraMusicalTitularApi[]
}

export function ObraMusicalTitularesTable({ titulares }: ObraMusicalTitularesTableProps) {
  if (!titulares?.length) {
    return (
      <EmptyState
        title="Nenhum titular vinculado"
        description="Os titulares desta obra serão exibidos aqui quando disponíveis na API."
      />
    )
  }

  return <DataTable columns={columns} data={titulares} />
}
