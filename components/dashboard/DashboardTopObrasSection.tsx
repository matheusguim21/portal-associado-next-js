'use client'

import { useMemo } from 'react'
import type { BiTitularReportData, ReportChartType } from '@/api/endpoints/financeiro/bi-titular/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBiChartConfig } from '@/components/financeiro/bi/use-bi-chart-config'
import { ReportChart } from '@/components/financeiro/bi/ReportChart'
import { ReportLegendList } from '@/components/financeiro/bi/ReportLegendList'

interface DashboardTopObrasSectionProps {
  data: BiTitularReportData
  chartType: ReportChartType
}

export function DashboardTopObrasSection({ data, chartType }: DashboardTopObrasSectionProps) {
  const { buildPieBarConfig, toChartData } = useBiChartConfig()
  const chartData = useMemo(
    () =>
      toChartData(
        data.topObras.map((obra) => ({ titulo: obra.titulo, valorPago: obra.valorPago })),
      ),
    [data.topObras, toChartData],
  )
  const chartConfig = useMemo(
    () =>
      buildPieBarConfig(
        data.topObras.map((obra) => ({ label: obra.titulo, valor: obra.valorPago })),
      ),
    [data.topObras, buildPieBarConfig],
  )

  const legendItems = chartData.map((item) => ({
    label: item.label,
    valor: item.valor,
    color: item.fill,
  }))

  const total = data.topObras.reduce((acc, o) => acc + o.valorPago, 0)

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-0">
        <CardTitle className="text-[15px] font-semibold">Top 5 Obras</CardTitle>
        <CardDescription className="text-[12px]">Maiores valores pagos no ano</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid items-center gap-8 lg:grid-cols-[3fr_1fr]">
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
