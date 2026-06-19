'use client'

import { useMemo } from 'react'
import type { BiTitularReportData, ReportChartType } from '@/api/endpoints/financeiro/bi-titular/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBiChartConfig } from '@/components/financeiro/bi/use-bi-chart-config'
import { OrigensMonthlyTable } from '@/components/financeiro/bi/OrigensMonthlyTable'
import { ReportChart } from '@/components/financeiro/bi/ReportChart'
import { ReportLegendList } from '@/components/financeiro/bi/ReportLegendList'
import { OrigensStackedAreaChart } from '@/components/financeiro/bi/charts/OrigensStackedAreaChart'
import { ReportChartEmpty } from '@/components/financeiro/bi/charts/ReportChartEmpty'

const ORIGEM_BAR_SERIES = ['valorDistribuicao', 'valorRetido', 'valorAjuste'] as const

interface DashboardOrigensSectionProps {
  data: BiTitularReportData
  chartType: ReportChartType
}

export function DashboardOrigensSection({ data, chartType }: DashboardOrigensSectionProps) {
  const { biChartConfig, buildPieBarConfig, toChartData } = useBiChartConfig()
  const hasMultipleMonths = data.origens.mensal.length >= 2
  const isGroupedBar = chartType === 'bar' && hasMultipleMonths

  const pieBarData = useMemo(() => toChartData(data.origens.chart), [data.origens.chart, toChartData])
  const pieBarConfig = useMemo(() => buildPieBarConfig(data.origens.chart), [data.origens.chart, buildPieBarConfig])

  const monthlySeriesData = useMemo(
    () =>
      data.origens.mensal.map((item) => ({
        periodo: item.periodo,
        valorDistribuicao: item.valorDistribuicao,
        valorRetido: item.valorRetido,
        valorAjuste: item.valorAjuste,
      })),
    [data.origens.mensal],
  )

  const legendItems = pieBarData.map((item) => ({
    label: item.label,
    valor: item.valor,
    color: item.fill,
  }))

  const chartConfig = isGroupedBar ? biChartConfig : pieBarConfig
  const chartData = isGroupedBar
    ? monthlySeriesData
    : pieBarData.map((item) => ({ label: item.label, valor: item.valor, fill: item.fill }))

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-0">
        <CardTitle className="text-[15px] font-semibold">Origem dos Recebimentos</CardTitle>
        <CardDescription className="text-[12px]">
          Distribuição por tipo no ano corrente
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div className="grid items-center gap-8 lg:grid-cols-[3fr_1fr]">
          <div className="w-full">
            {chartType === 'area' ? (
              monthlySeriesData.length ? (
                <OrigensStackedAreaChart config={biChartConfig} data={monthlySeriesData} />
              ) : (
                <ReportChartEmpty />
              )
            ) : (
              <ReportChart
                type={chartType}
                config={chartConfig}
                data={chartData}
                barVariant={isGroupedBar ? 'grouped' : 'simple'}
                seriesKeys={isGroupedBar ? [...ORIGEM_BAR_SERIES] : undefined}
                xAxisKey={isGroupedBar ? 'periodo' : undefined}
              />
            )}
          </div>
          <ReportLegendList items={legendItems} total={data.totalGeral} />
        </div>
        {data.origens.mensal.length > 0 && <OrigensMonthlyTable rows={data.origens.mensal} />}
      </CardContent>
    </Card>
  )
}
