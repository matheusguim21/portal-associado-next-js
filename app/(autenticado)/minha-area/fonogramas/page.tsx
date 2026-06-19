'use client'

import { useMemo, useState } from 'react'
import { useMeusFonogramas } from '@/api/endpoints/documentacao/fonograma/use-paginated-fonogramas'
import { FonogramaDetailModal } from '@/components/documentacao/fonograma/FonogramaDetailModal'
import { FonogramaIsrcGate } from '@/components/documentacao/fonograma/FonogramaIsrcGate'
import {
  createFonogramaVerColumn,
  fonogramaMinhaAreaColumns,
} from '@/components/documentacao/fonograma/fonograma-columns'
import { PageHeader } from '@/components/page-header'
import { SearchFormActions } from '@/components/search-form-actions'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { Input } from '@/components/ui/input'
import { TableFiltersCard, TableFiltersLabel } from '@/components/ui/table-filters'
import type { FonogramaApi } from '@/types/api/documentacao'

export default function MeusFonogramasPage() {
  const [titulo, setTitulo] = useState('')
  const [results, setResults] = useState<FonogramaApi[]>([])
  const [selectedFonogramaId, setSelectedFonogramaId] = useState<number | null>(null)
  const { mutate: pesquisar, isPending } = useMeusFonogramas()

  const tableColumns = useMemo(
    () => [...fonogramaMinhaAreaColumns, createFonogramaVerColumn((f) => setSelectedFonogramaId(f.id))],
    [],
  )

  return (
    <div className="space-y-4">
      <PageHeader title="Meus Fonogramas" description="Fonogramas vinculados ao seu cadastro." />

      <FonogramaIsrcGate>
        <TableFiltersCard>
          <div className="flex flex-col gap-1.5 min-w-[240px] flex-1">
            <TableFiltersLabel htmlFor="titulo">Título</TableFiltersLabel>
            <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <SearchFormActions
            onSearch={() =>
              pesquisar({ titulo: titulo || undefined, page: 0, size: 20 }, {
                onSuccess: (data) => setResults(data.content ?? []),
              })
            }
            onClear={() => {
              setTitulo('')
              setResults([])
            }}
            searching={isPending}
          />
        </TableFiltersCard>
        {results.length === 0 && !isPending ? (
          <EmptyState />
        ) : (
          <DataTable columns={tableColumns} data={results} loading={isPending} />
        )}
      </FonogramaIsrcGate>

      <FonogramaDetailModal
        fonogramaId={selectedFonogramaId}
        onOpenChange={(open) => !open && setSelectedFonogramaId(null)}
      />
    </div>
  )
}
