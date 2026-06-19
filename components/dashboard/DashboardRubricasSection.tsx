'use client'

import { useMemo } from 'react'
import type { BiTitularReportData, ReportChartType } from '@/api/endpoints/financeiro/bi-titular/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBiChartConfig } from '@/components/financeiro/bi/use-bi-chart-config'
import { ReportChart } from '@/components/financeiro/bi/ReportChart'
import { ReportLegendList } from '@/components/financeiro/bi/ReportLegendList'

interface DashboardRubricasSectionProps {
  data: BiTitularReportData
  chartType: ReportChartType
}

export function DashboardRubricasSection({ data, chartType }: DashboardRubricasSectionProps) {
  const { buildPieBarConfig, toChartData } = useBiChartConfig()
  const chartData = useMemo(() => toChartData(data.rubricas), [data.rubricas, toChartData])
  const chartConfig = useMemo(
    () => buildPieBarConfig(data.rubricas.map((r) => ({ label: r.descricao, valor: r.valor }))),
    [data.rubricas, buildPieBarConfig],
  )

  const legendItems = chartData.map((item) => ({
    label: item.label,
    valor: item.valor,
    color: item.fill,
  }))

  const total = data.rubricas.reduce((acc, r) => acc + r.valor, 0)

  return (
    <Card className="border-border/60 h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-[15px] font-semibold">Rubricas ECAD</CardTitle>
        <CardDescription className="text-[12px]">Agrupamentos no ano corrente</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid items-center gap-6 lg:grid-cols-[3fr_1fr]">
          <ReportChart
            type={chartType}
            config={chartConfig}
            data={chartData.map((item) => ({
              label: item.label,
              valor: item.valor,
              fill: item.fill,
            }))}
          />
          <ReportLegendList items={legendItems} total={total} />
        </div>
      </CardContent>
    </Card>
  )
}
