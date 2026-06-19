import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import type { ReportBarChartVariant } from '@/api/endpoints/financeiro/bi-titular/types'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatarMoeda } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  CATEGORY_AXIS_PROPS,
  CHART_HEIGHT_CLASS,
  PERIOD_AXIS_PROPS,
  truncateChartLabel,
  type ReportChartDataItem,
} from './chart-constants'

interface ReportBarChartProps {
  config: ChartConfig
  data: ReportChartDataItem[]
  barVariant?: ReportBarChartVariant
  seriesKeys?: string[]
  dataKey?: string
  nameKey?: string
  xAxisKey?: string
  className?: string
}

export function ReportBarChart({
  config,
  data,
  barVariant = 'simple',
  seriesKeys = [],
  dataKey = 'valor',
  nameKey = 'label',
  xAxisKey = 'periodo',
  className,
}: ReportBarChartProps) {
  const tooltipContent = (
    <ChartTooltipContent
      formatter={(value, name, item) => {
        const key = String(item.dataKey ?? name)
        const label = config[key]?.label ?? name
        return (
          <div className="flex flex-1 items-center justify-between gap-4 leading-none">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono font-medium tabular-nums text-foreground">
              {formatarMoeda(Number(value))}
            </span>
          </div>
        )
      }}
    />
  )

  if (barVariant === 'grouped' && seriesKeys.length > 0) {
    return (
      <ChartContainer config={config} className={cn(CHART_HEIGHT_CLASS, className)}>
        <BarChart
          data={data}
          margin={{ left: 8, right: 24, top: 8, bottom: 16 }}
          barCategoryGap="20%"
          barGap={4}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} {...PERIOD_AXIS_PROPS} />
          <YAxis hide />
          <ChartTooltip content={tooltipContent} />
          <ChartLegend content={<ChartLegendContent />} />
          {seriesKeys.map((key) => (
            <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer config={config} className={cn(CHART_HEIGHT_CLASS, className)}>
      <BarChart
        data={data}
        margin={{ left: 8, right: 24, top: 8, bottom: 16 }}
        barCategoryGap="20%"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={nameKey}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => truncateChartLabel(String(v))}
          {...CATEGORY_AXIS_PROPS}
        />
        <YAxis hide />
        <ChartTooltip content={tooltipContent} />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={String(entry.fill)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
