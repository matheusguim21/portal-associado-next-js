'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useGetBiTitularReport } from '@/api/endpoints/financeiro/bi-titular/use-bi-titular-report'
import type { ReportChartType } from '@/api/endpoints/financeiro/bi-titular/types'
import { useGetSaldoTitular } from '@/api/endpoints/financeiro/use-financeiro-queries'
import { DashboardCategoriasSection } from '@/components/dashboard/DashboardCategoriasSection'
import { DashboardKpiCards } from '@/components/dashboard/DashboardKpiCards'
import { DashboardOrigensSection } from '@/components/dashboard/DashboardOrigensSection'
import { DashboardRepertorioSection } from '@/components/dashboard/DashboardRepertorioSection'
import { DashboardRubricasSection } from '@/components/dashboard/DashboardRubricasSection'
import { DashboardTopObrasSection } from '@/components/dashboard/DashboardTopObrasSection'
import { ReportChartToggle } from '@/components/financeiro/bi/ReportChartToggle'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useTitularId } from '@/hooks/use-auth'

function generateYears(count = 5): number[] {
  const current = new Date().getFullYear()
  return Array.from({ length: count }, (_, i) => current - i)
}

const YEARS = generateYears()

export default function DashboardPage() {
  const titularId = useTitularId()
  const [ano, setAno] = useState(() => new Date().getFullYear())
  const [chartType, setChartType] = useState<ReportChartType>('pie')

  const { data: report, isLoading, isError, errorMessage } = useGetBiTitularReport(titularId, ano)
  const { data: saldo, isLoading: loadingSaldo } = useGetSaldoTitular(titularId)

  const hasMultipleMonths = (report?.origens.mensal.length ?? 0) >= 2

  useEffect(() => {
    if (!hasMultipleMonths && chartType === 'area') {
      setChartType('pie')
    }
  }, [hasMultipleMonths, chartType])

  return (
    <div className="flex flex-col gap-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visão geral das suas distribuições e receitas
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={String(ano)} onValueChange={(v) => v && setAno(Number(v))}>
            <SelectTrigger className="w-[100px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" render={<Link href="/financeiro/ecad/demonstrativos" />}>
            <ArrowUpRight className="size-3.5" data-icon="inline-start" />
            Ver demonstrativos
          </Button>
        </div>
      </div>

      <ReportChartToggle
        value={chartType}
        onChange={setChartType}
        disableArea={!hasMultipleMonths}
      />

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage ?? 'Não foi possível carregar os dados do dashboard.'}
        </div>
      )}

      <DashboardKpiCards
        totalGeral={report?.totalGeral}
        saldo={saldo?.saldo}
        irrf={saldo?.irrf}
        ano={ano}
        loadingBi={isLoading}
        loadingSaldo={loadingSaldo}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[420px] w-full rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-[360px] w-full rounded-lg" />
            <Skeleton className="h-[360px] w-full rounded-lg" />
          </div>
          <Skeleton className="h-[360px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      ) : report ? (
        <>
          <DashboardOrigensSection data={report} chartType={chartType} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DashboardCategoriasSection data={report} chartType={chartType} />
            <DashboardRubricasSection data={report} chartType={chartType} />
          </div>

          <DashboardTopObrasSection data={report} chartType={chartType} />
          <DashboardRepertorioSection data={report} />
        </>
      ) : !isError ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          Sem dados para o período selecionado.
        </p>
      ) : null}
    </div>
  )
}
