'use client'

import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/page-header'
import {
  createDemonstrativoEcadDownloadColumn,
  demonstrativoEcadColumns,
} from '@/components/financeiro/demonstrativo-ecad-columns'
import { FinanceFiltersBar, FinanceFiltersLabel } from '@/components/finance-filters-bar'
import { MaskedInput } from '@/components/ui/masked-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchFormActions } from '@/components/search-form-actions'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/empty-state'
import { useGetDemonstrativosEcad } from '@/api/endpoints/financeiro/use-financeiro-queries'
import type { DemonstrativoEcadApi } from '@/types/api/documentacao'
import { formatMonthYear, normalizeMonthYear } from '@/lib/masks'
import { toast } from 'sonner'

export default function EcadDemonstrativosPage() {
  const [periodo, setPeriodo] = useState('')
  const [grupo, setGrupo] = useState('todos')
  const [results, setResults] = useState<DemonstrativoEcadApi[]>([])
  const { mutate: pesquisar, isPending } = useGetDemonstrativosEcad()

  function handlePesquisar() {
    const periodoFormatado =
      periodo && normalizeMonthYear(periodo).length === 6
        ? formatMonthYear(periodo)
        : periodo || undefined
    pesquisar(
      { periodo: periodoFormatado, grupo: grupo === 'todos' ? undefined : grupo },
      {
        onSuccess: (data) => setResults(Array.isArray(data) ? data : []),
      },
    )
  }

  const columns = useMemo(
    () => [
      ...demonstrativoEcadColumns,
      createDemonstrativoEcadDownloadColumn((item) =>
        toast.info(`Download: ${item.nomeArquivo ?? 'demonstrativo'}`),
      ),
    ],
    [],
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Demonstrativos ECAD"
        description="Demonstrativos de recebimentos disponibilizados pelo ECAD."
      />

      <FinanceFiltersBar>
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <FinanceFiltersLabel htmlFor="periodo">Período (MM/AAAA)</FinanceFiltersLabel>
          <MaskedInput
            id="periodo"
            mask="monthYear"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="05/2026"
            value={periodo}
            onChange={setPeriodo}
          />
        </div>
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <FinanceFiltersLabel htmlFor="grupo">Grupo</FinanceFiltersLabel>
          <Select value={grupo} onValueChange={setGrupo}>
            <SelectTrigger id="grupo" className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="DISTRIBUIÇÃO">Distribuição</SelectItem>
              <SelectItem value="RADIODIFUSÃO">Radiodifusão</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SearchFormActions onSearch={handlePesquisar} onClear={() => { setPeriodo(''); setGrupo('todos'); setResults([]) }} searching={isPending} />
      </FinanceFiltersBar>

      {results.length === 0 && !isPending ? (
        <EmptyState />
      ) : (
        <DataTable columns={columns} data={results} loading={isPending} />
      )}
    </div>
  )
}
