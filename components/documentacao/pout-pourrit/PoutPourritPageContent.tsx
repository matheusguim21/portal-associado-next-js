'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { poutPourritCadastroColumns } from '@/components/documentacao/pout-pourrit/pout-pourrit-columns'
import { Input } from '@/components/ui/input'
import { TableFiltersCard, TableFiltersLabel } from '@/components/ui/table-filters'
import { SearchFormActions } from '@/components/search-form-actions'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { usePaginatedPoutPourrit } from '@/api/endpoints/documentacao/use-documentacao-queries'
import type { PoutPourritApi } from '@/types/api/documentacao'

export function PoutPourritPageContent() {
  const [titulo, setTitulo] = useState('')
  const [results, setResults] = useState<PoutPourritApi[]>([])
  const { mutate: pesquisar, isPending } = usePaginatedPoutPourrit()

  return (
    <div className="space-y-4">
      <PageHeader title="Pout-Pourrit" description="Gerenciar pout-pourrits." />
      <TableFiltersCard>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <TableFiltersLabel>Título</TableFiltersLabel>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <SearchFormActions
          onSearch={() =>
            pesquisar({ titulo: titulo || undefined, page: 0, size: 20 }, {
              onSuccess: (data: { content?: PoutPourritApi[] }) => setResults(data.content ?? []),
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
        <DataTable columns={poutPourritCadastroColumns} data={results} loading={isPending} />
      )}
    </div>
  )
}
