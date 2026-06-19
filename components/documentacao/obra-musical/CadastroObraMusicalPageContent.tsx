'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ObraMusicalSearchForm } from '@/components/documentacao/obra-musical/ObraMusicalSearchForm'
import {
  createObraMusicalCadastroAcoesColumn,
  obraMusicalCadastroColumns,
} from '@/components/documentacao/obra-musical/obra-musical-columns'
import { SearchResultsToolbar } from '@/components/search-results-toolbar'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { useMeusObras } from '@/api/endpoints/documentacao/obra-musical/use-paginated-obras-musicais'
import { useTitularId } from '@/hooks/use-auth'
import { usePaginatedSearch } from '@/hooks/use-paginated-search'
import { obraFormToApiParams } from '@/lib/search/to-api-params'
import type { SearchObraMusicalFormData } from '@/schemas/search-obra-musical-schema'
import type { ObraMusicalApi, ObraMusicalFiltro } from '@/types/api/documentacao'

const INITIAL_FILTERS: SearchObraMusicalFormData = {
  pesquisa: 'COMECANDO',
  titulo: '',
}

type CadastroObraMusicalPageContentProps = {
  initialSearch?: {
    filters: SearchObraMusicalFormData
    results: ObraMusicalApi[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    sort?: string
  }
}

export function CadastroObraMusicalPageContent({ initialSearch }: CadastroObraMusicalPageContentProps) {
  const pathname = usePathname()
  const titularId = useTitularId()
  const { mutate: pesquisar, isPending } = useMeusObras()

  const buildParams = useCallback(
    (filters: SearchObraMusicalFormData, pagination: { page: number; size: number; sort?: string }) => {
      const params = obraFormToApiParams(filters, pagination)
      return {
        ...params,
        titularId: titularId ?? params.titularId,
        sort: pagination.sort ?? 'id,desc',
      } satisfies ObraMusicalFiltro
    },
    [titularId],
  )

  const search = usePaginatedSearch<SearchObraMusicalFormData, ObraMusicalFiltro, ObraMusicalApi>({
    mutate: pesquisar,
    buildParams,
    defaultSize: 10,
    initialState: initialSearch,
  })

  useEffect(() => {
    if (initialSearch || !titularId) return
    search.applyFilters(INITIAL_FILTERS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titularId, pathname, initialSearch])

  const columns = useMemo(
    () => [
      ...obraMusicalCadastroColumns,
      createObraMusicalCadastroAcoesColumn({
        onGerarOcorrenciaSuccess: () => {
          if (search.filters) search.applyFilters(search.filters)
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search.filters],
  )

  const showTableSkeleton = isPending && search.results.length === 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cadastro — Obra Musical"
        description="Suas obras musicais cadastradas na SOCINPRO."
        actions={
          <Button render={<Link href="/obras/cadastro/nova" />}>
            <Plus className="size-4" />
            Nova obra
          </Button>
        }
      />

      <ObraMusicalSearchForm
        mode="meus"
        onSubmit={search.applyFilters}
        onClear={() => {
          search.clear()
          if (titularId) search.applyFilters(INITIAL_FILTERS)
        }}
        isPending={isPending}
      />

      {!titularId ? (
        <EmptyState
          title="Titular não identificado"
          description="Não foi possível carregar suas obras. Verifique sua sessão."
        />
      ) : !search.hasSearched ? (
        <p className="text-sm text-muted-foreground">Carregando suas obras...</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={search.results}
            loading={showTableSkeleton}
            emptyMessage={
              isPending
                ? 'Carregando obras...'
                : 'Nenhuma obra encontrada para os filtros informados.'
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
    </div>
  )
}
