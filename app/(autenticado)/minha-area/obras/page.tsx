'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { minhaAreaObrasColumns } from '@/components/minha-area/obras-columns'
import { Input } from '@/components/ui/input'
import { TableFiltersCard, TableFiltersLabel } from '@/components/ui/table-filters'
import { SearchFormActions } from '@/components/search-form-actions'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { useMeusObras } from '@/api/endpoints/documentacao/obra-musical/use-paginated-obras-musicais'
import { useTitularId } from '@/hooks/use-auth'
import type { ObraMusicalApi } from '@/types/api/documentacao'

export default function MinhasObrasPage() {
  const titularId = useTitularId()
  const [titulo, setTitulo] = useState('')
  const [results, setResults] = useState<ObraMusicalApi[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const { mutate: pesquisar } = useMeusObras()

  function handlePesquisar() {
    if (!titularId) return
    setHasSearched(true)
    setIsSearching(true)
    pesquisar(
      { titulo: titulo || undefined, titularId, pesquisa: 'CONTENDO', page: 0, size: 20 },
      {
        onSuccess: (data) => setResults(data.content ?? []),
        onSettled: () => setIsSearching(false),
      },
    )
  }

  const showTableSkeleton = isSearching && results.length === 0

  return (
    <div className="space-y-4">
      <PageHeader title="Minhas Obras" description="Obras vinculadas ao seu cadastro de titular." />
      <TableFiltersCard>
        <div className="flex flex-col gap-1.5 min-w-[240px] flex-1">
          <TableFiltersLabel htmlFor="titulo">Título</TableFiltersLabel>
          <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <SearchFormActions
          onSearch={handlePesquisar}
          onClear={() => {
            setTitulo('')
            setResults([])
            setHasSearched(false)
            setIsSearching(false)
          }}
          searching={isSearching}
        />
      </TableFiltersCard>
      {!titularId ? (
        <EmptyState
          title="Titular não identificado"
          description="Não foi possível carregar suas obras. Verifique sua sessão."
        />
      ) : !hasSearched ? (
        <EmptyState title="Informe um filtro e clique em Pesquisar" />
      ) : (
        <DataTable
          columns={minhaAreaObrasColumns}
          data={results}
          loading={showTableSkeleton}
          emptyMessage={
            isSearching ? 'Carregando obras...' : 'Nenhuma obra encontrada para os filtros informados.'
          }
        />
      )}
    </div>
  )
}
