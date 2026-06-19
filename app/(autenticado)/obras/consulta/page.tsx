'use client'

import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { ObraMusicalSearchForm } from '@/components/documentacao/obra-musical/ObraMusicalSearchForm'
import { ObraMusicalDetailModal } from '@/components/documentacao/obra-musical/ObraMusicalDetailModal'
import {
  createObraMusicalVerColumn,
  obraMusicalConsultaColumns,
} from '@/components/documentacao/obra-musical/obra-musical-columns'
import { SearchResultsToolbar } from '@/components/search-results-toolbar'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { usePaginatedObrasMusicais } from '@/api/endpoints/documentacao/obra-musical/use-paginated-obras-musicais'
import { usePaginatedSearch } from '@/hooks/use-paginated-search'
import { obraFormToApiParams } from '@/lib/search/to-api-params'
import type { SearchObraMusicalFormData } from '@/schemas/search-obra-musical-schema'
import type { ObraMusicalApi } from '@/types/api/documentacao'

export default function ConsultaObraMusicalPage() {
  const [selectedObraId, setSelectedObraId] = useState<number | null>(null)
  const { mutate: pesquisar } = usePaginatedObrasMusicais()

  const search = usePaginatedSearch<SearchObraMusicalFormData, ReturnType<typeof obraFormToApiParams>, ObraMusicalApi>({
    mutate: pesquisar,
    buildParams: obraFormToApiParams,
  })

  const showTableSkeleton = search.isSearching && search.results.length === 0

  const tableColumns = useMemo(
    () => [...obraMusicalConsultaColumns, createObraMusicalVerColumn((obra) => setSelectedObraId(obra.id))],
    [],
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Consulta — Obra Musical"
        description="Pesquise obras musicais cadastradas no sistema."
      />

      <ObraMusicalSearchForm
        mode="consulta"
        onSubmit={search.applyFilters}
        onClear={search.clear}
        isPending={search.isSearching}
      />

      {!search.hasSearched && !search.isSearching ? (
        <EmptyState />
      ) : (
        <>
          <DataTable columns={tableColumns} data={search.results} loading={showTableSkeleton} />
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

      <ObraMusicalDetailModal
        obraId={selectedObraId}
        onOpenChange={(open) => !open && setSelectedObraId(null)}
      />
    </div>
  )
}
