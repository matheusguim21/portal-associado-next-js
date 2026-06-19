'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { minhaAreaOcorrenciasColumns } from '@/components/minha-area/ocorrencias-columns'
import { SearchFormActions } from '@/components/search-form-actions'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { usePaginatedOcorrencias } from '@/api/endpoints/documentacao/use-documentacao-queries'
import type { ArquivoRepertorioApi } from '@/types/api/documentacao'

export default function MinhasOcorrenciasPage() {
  const [results, setResults] = useState<ArquivoRepertorioApi[]>([])
  const { mutate: pesquisar, isPending } = usePaginatedOcorrencias()

  return (
    <div className="space-y-4">
      <PageHeader title="Minhas Ocorrências" description="Arquivos de repertório e ocorrências." />
      <SearchFormActions
        onSearch={() =>
          pesquisar({ page: 0, size: 20 }, {
            onSuccess: (data: { content?: ArquivoRepertorioApi[] }) => setResults(data.content ?? []),
          })
        }
        onClear={() => setResults([])}
        searching={isPending}
      />
      {results.length === 0 && !isPending ? (
        <EmptyState />
      ) : (
        <DataTable columns={minhaAreaOcorrenciasColumns} data={results} loading={isPending} />
      )}
    </div>
  )
}
