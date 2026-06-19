'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { demonstrativoSocColumns } from '@/components/financeiro/demonstrativo-soc-columns'
import { FinanceFiltersBar, FinanceFiltersLabel } from '@/components/finance-filters-bar'
import { MaskedInput } from '@/components/ui/masked-input'
import { SearchFormActions } from '@/components/search-form-actions'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { useGetDemonstrativosSoc } from '@/api/endpoints/financeiro/use-financeiro-queries'
import { useTitularId } from '@/hooks/use-auth'
import { formatMonthYear, normalizeMonthYear } from '@/lib/masks'
import type { DemonstrativoSocApi } from '@/types/api/documentacao'

export default function SocDemonstrativoPage() {
  const titularId = useTitularId()
  const [periodoInicial, setPeriodoInicial] = useState('')
  const [periodoFinal, setPeriodoFinal] = useState('')
  const [results, setResults] = useState<DemonstrativoSocApi[]>([])
  const { mutate: pesquisar, isPending } = useGetDemonstrativosSoc()

  function formatPeriodo(value: string) {
    return value && normalizeMonthYear(value).length === 6 ? formatMonthYear(value) : value
  }

  function handlePesquisar() {
    if (!titularId) return
    pesquisar(
      {
        titularId,
        periodoInicial: formatPeriodo(periodoInicial),
        periodoFinal: formatPeriodo(periodoFinal),
      },
      { onSuccess: (data) => setResults(Array.isArray(data) ? data : []) },
    )
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Demonstrativo SOCINPRO"
        description="Pagamentos e demonstrativos de distribuição SOCINPRO."
      />
      <FinanceFiltersBar>
        <div className="flex flex-col gap-1.5">
          <FinanceFiltersLabel>Período inicial (MM/yyyy)</FinanceFiltersLabel>
          <MaskedInput
            mask="monthYear"
            className="bg-white/10 border-white/20 text-white"
            placeholder="05/2026"
            value={periodoInicial}
            onChange={setPeriodoInicial}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FinanceFiltersLabel>Período final (MM/yyyy)</FinanceFiltersLabel>
          <MaskedInput
            mask="monthYear"
            className="bg-white/10 border-white/20 text-white"
            placeholder="05/2026"
            value={periodoFinal}
            onChange={setPeriodoFinal}
          />
        </div>
        <SearchFormActions
          onSearch={handlePesquisar}
          onClear={() => {
            setPeriodoInicial('')
            setPeriodoFinal('')
            setResults([])
          }}
          searching={isPending}
        />
      </FinanceFiltersBar>
      {results.length === 0 && !isPending ? (
        <EmptyState />
      ) : (
        <DataTable columns={demonstrativoSocColumns} data={results} loading={isPending} />
      )}
    </div>
  )
}
