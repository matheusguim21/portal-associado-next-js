import type { ReportBarChartVariant, ReportChartType } from '@/api/endpoints/financeiro/bi-titular/types'
import type { ChartConfig } from '@/components/ui/chart'
import { ReportAreaChart } from './charts/ReportAreaChart'
import { ReportBarChart } from './charts/ReportBarChart'
import { ReportChartEmpty } from './charts/ReportChartEmpty'
import { ReportPieChart } from './charts/ReportPieChart'
import type { ReportChartDataItem } from './charts/chart-constants'

interface ReportChartProps {
  type: ReportChartType
  config: ChartConfig
  data: ReportChartDataItem[]
  barVariant?: ReportBarChartVariant
  seriesKeys?: string[]
  xAxisKey?: string
  dataKey?: string
  nameKey?: string
  className?: string
}

export function ReportChart({
  type,
  config,
  data,
  barVariant = 'simple',
  seriesKeys,
  xAxisKey,
  dataKey = 'valor',
  nameKey = 'label',
  className,
}: ReportChartProps) {
  if (!data.length) {
    return <ReportChartEmpty className={className} />
  }

  if (type === 'pie') {
    return (
      <ReportPieChart
        config={config}
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        className={className}
      />
    )
  }

  if (type === 'bar') {
    return (
      <ReportBarChart
        config={config}
        data={data}
        barVariant={barVariant}
        seriesKeys={seriesKeys}
        dataKey={dataKey}
        nameKey={nameKey}
        xAxisKey={xAxisKey}
        className={className}
      />
    )
  }

  return (
    <ReportAreaChart
      config={config}
      data={data}
      dataKey={dataKey}
      nameKey={nameKey}
      className={className}
    />
  )
}
