'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useIsrcHabilitado } from '@/api/endpoints/documentacao/fonograma/use-isrc-habilitado'
import { useMeusFonogramas } from '@/api/endpoints/documentacao/fonograma/use-paginated-fonogramas'
import { FonogramaIsrcGate } from '@/components/documentacao/fonograma/FonogramaIsrcGate'
import { FonogramaSearchForm } from '@/components/documentacao/fonograma/FonogramaSearchForm'
import {
  createFonogramaVerColumn,
  fonogramaCadastroColumns,
} from '@/components/documentacao/fonograma/fonograma-columns'
import { FonogramaDetailModal } from '@/components/documentacao/fonograma/FonogramaDetailModal'
import { PageHeader } from '@/components/page-header'
import { SearchResultsToolbar } from '@/components/search-results-toolbar'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { useTitularId } from '@/hooks/use-auth'
import { usePaginatedSearch } from '@/hooks/use-paginated-search'
import { fonogramaFormToApiParams } from '@/lib/search/to-api-params'
import type { SearchFonogramaFormData } from '@/schemas/search-fonograma-schema'
import type { FonogramaApi, FonogramaFiltro } from '@/types/api/documentacao'

export function CadastroFonogramaPageContent() {
  const [selectedFonogramaId, setSelectedFonogramaId] = useState<number | null>(null)
  const titularId = useTitularId()
  const { data: isrcStatus } = useIsrcHabilitado()
  const { mutate: pesquisar } = useMeusFonogramas()

  const buildParams = useCallback(
    (filters: SearchFonogramaFormData, pagination: { page: number; size: number; sort?: string }) => {
      const params = fonogramaFormToApiParams(filters, pagination)
      return {
        ...params,
        titularId: titularId ?? params.titularId,
      } satisfies FonogramaFiltro
    },
    [titularId],
  )

  const search = usePaginatedSearch<SearchFonogramaFormData, FonogramaFiltro, FonogramaApi>({
    mutate: pesquisar,
    buildParams,
  })

  const columns = useMemo(
    () => [...fonogramaCadastroColumns, createFonogramaVerColumn((f) => setSelectedFonogramaId(f.id))],
    [],
  )

  const showTableSkeleton = search.isSearching && search.results.length === 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cadastro — Fonograma"
        description="Seus fonogramas cadastrados na SOCINPRO."
        actions={
          isrcStatus?.habilitado ? (
            <Button render={<Link href="/fonogramas/cadastro/nova" />}>
              <Plus className="size-4" />
              Nova fonograma
            </Button>
          ) : undefined
        }
      />

      <FonogramaIsrcGate>
        <FonogramaSearchForm
          mode="meus"
          showTipoObmPop={false}
          onSubmit={search.applyFilters}
          onClear={search.clear}
          isPending={search.isSearching}
        />

        {!titularId ? (
          <EmptyState
            title="Titular não identificado"
            description="Não foi possível carregar seus fonogramas. Verifique sua sessão."
          />
        ) : !search.hasSearched ? (
          <EmptyState title="Informe um filtro e clique em Pesquisar" />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={search.results}
              loading={showTableSkeleton}
              emptyMessage={
                search.isSearching
                  ? 'Carregando fonogramas...'
                  : 'Nenhum fonograma encontrado para os filtros informados.'
              }
            />
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
      </FonogramaIsrcGate>

      <FonogramaDetailModal
        fonogramaId={selectedFonogramaId}
        onOpenChange={(open) => !open && setSelectedFonogramaId(null)}
      />
    </div>
  )
}
