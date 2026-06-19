'use client'

import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { FonogramaSearchForm } from '@/components/documentacao/fonograma/FonogramaSearchForm'
import { FonogramaDetailModal } from '@/components/documentacao/fonograma/FonogramaDetailModal'
import {
  createFonogramaVerColumn,
  fonogramaConsultaColumns,
} from '@/components/documentacao/fonograma/fonograma-columns'
import { SearchResultsToolbar } from '@/components/search-results-toolbar'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { usePaginatedFonogramas } from '@/api/endpoints/documentacao/fonograma/use-paginated-fonogramas'
import { usePaginatedSearch } from '@/hooks/use-paginated-search'
import { fonogramaFormToApiParams } from '@/lib/search/to-api-params'
import type { SearchFonogramaFormData } from '@/schemas/search-fonograma-schema'
import type { FonogramaApi } from '@/types/api/documentacao'

export default function ConsultaFonogramaPage() {
  const [selectedFonogramaId, setSelectedFonogramaId] = useState<number | null>(null)
  const { mutate: pesquisar, isPending } = usePaginatedFonogramas()

  const search = usePaginatedSearch<SearchFonogramaFormData, ReturnType<typeof fonogramaFormToApiParams>, FonogramaApi>({
    mutate: pesquisar,
    buildParams: fonogramaFormToApiParams,
  })

  const tableColumns = useMemo(
    () => [...fonogramaConsultaColumns, createFonogramaVerColumn((f) => setSelectedFonogramaId(f.id))],
    [],
  )

  return (
    <div className="space-y-4">
      <PageHeader title="Consulta — Fonograma" description="Pesquise fonogramas cadastrados." />

      <FonogramaSearchForm
        mode="consulta"
        onSubmit={search.applyFilters}
        onClear={search.clear}
        isPending={isPending}
      />

      {!search.hasSearched && !isPending ? (
        <EmptyState />
      ) : (
        <>
          <DataTable columns={tableColumns} data={search.results} loading={isPending} />
          <SearchResultsToolbar
            page={search.page}
            size={search.size}
            totalElements={search.totalElements}
            totalPages={search.totalPages}
            onPageChange={search.goToPage}
            onSizeChange={search.changeSize}
          />
        </>
      )}

      <FonogramaDetailModal
        fonogramaId={selectedFonogramaId}
        onOpenChange={(open) => !open && setSelectedFonogramaId(null)}
      />
    </div>
  )
}
