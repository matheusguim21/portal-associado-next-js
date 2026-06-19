'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { coletivoCadastroColumns } from '@/components/documentacao/coletivo/coletivo-columns'
import { Input } from '@/components/ui/input'
import { TableFiltersCard, TableFiltersLabel } from '@/components/ui/table-filters'
import { SearchFormActions } from '@/components/search-form-actions'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { usePaginatedColetivos } from '@/api/endpoints/documentacao/use-documentacao-queries'
import type { ColetivoApi } from '@/types/api/documentacao'

export function ColetivoPageContent() {
  const [nome, setNome] = useState('')
  const [results, setResults] = useState<ColetivoApi[]>([])
  const { mutate: pesquisar, isPending } = usePaginatedColetivos()

  return (
    <div className="space-y-4">
      <PageHeader title="Coletivo" description="Gerenciar coletivos musicais." />
      <TableFiltersCard>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <TableFiltersLabel>Nome</TableFiltersLabel>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <SearchFormActions
          onSearch={() =>
            pesquisar({ nome: nome || undefined, page: 0, size: 20 }, {
              onSuccess: (data: { content?: ColetivoApi[] }) => setResults(data.content ?? []),
            })
          }
          onClear={() => {
            setNome('')
            setResults([])
          }}
          searching={isPending}
        />
      </TableFiltersCard>
      {results.length === 0 && !isPending ? (
        <EmptyState />
      ) : (
        <DataTable columns={coletivoCadastroColumns} data={results} loading={isPending} />
      )}
    </div>
  )
}
