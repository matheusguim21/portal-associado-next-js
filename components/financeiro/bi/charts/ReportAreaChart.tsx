import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatarMoeda } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  CATEGORY_AXIS_PROPS,
  CHART_HEIGHT_CLASS,
  truncateChartLabel,
  type ReportChartDataItem,
} from './chart-constants'

interface ReportAreaChartProps {
  config: ChartConfig
  data: ReportChartDataItem[]
  dataKey?: string
  nameKey?: string
  className?: string
}

export function ReportAreaChart({
  config,
  data,
  dataKey = 'valor',
  nameKey = 'label',
  className,
}: ReportAreaChartProps) {
  const gradientId = `area-gradient-${dataKey}`

  return (
    <ChartContainer config={config} className={cn(CHART_HEIGHT_CLASS, className)}>
      <AreaChart data={data} margin={{ left: 8, right: 24, top: 8, bottom: 16 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            {data.map((item, index) => (
              <stop
                key={index}
                offset={data.length <= 1 ? '0%' : `${(index / (data.length - 1)) * 100}%`}
                stopColor={String(item.fill)}
              />
            ))}
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={nameKey}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => truncateChartLabel(String(v))}
          {...CATEGORY_AXIS_PROPS}
        />
        <YAxis hide />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => (
                <div className="grid gap-1">
                  <span className="font-medium">{String(item.payload?.[nameKey] ?? name)}</span>
                  <span className="font-mono font-medium tabular-nums">
                    {formatarMoeda(Number(value))}
                  </span>
                </div>
              )}
            />
          }
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={String(data[0]?.fill ?? '#002E3B')}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  )
}
