import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
  CHART_HEIGHT_CLASS,
  CHART_OVERFLOW_VISIBLE_CLASS,
  PERIOD_AXIS_PROPS,
  type ReportChartDataItem,
} from './chart-constants'

const STACKED_AREA_SERIES = ['valorAjuste', 'valorRetido', 'valorDistribuicao'] as const

interface OrigensStackedAreaChartProps {
  config: ChartConfig
  data: ReportChartDataItem[]
  className?: string
}

export function OrigensStackedAreaChart({ config, data, className }: OrigensStackedAreaChartProps) {
  return (
    <ChartContainer
      config={config}
      className={cn(CHART_HEIGHT_CLASS, CHART_OVERFLOW_VISIBLE_CLASS, className)}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 4, right: 4, top: 8, bottom: 32 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="periodo" tickLine={false} axisLine={false} {...PERIOD_AXIS_PROPS} />
        <YAxis hide />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={(value) => formatarMoeda(Number(value))}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {STACKED_AREA_SERIES.map((key) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="origens"
            stroke={`var(--color-${key})`}
            fill={`var(--color-${key})`}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}
