import { Cell, Label, Pie, PieChart, Sector, type PieSectorShapeProps } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatarMoeda } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CHART_HEIGHT_CLASS, type ReportChartDataItem } from './chart-constants'
import { PieChartTotalLabel } from './PieChartTotalLabel'

function renderPieSector(props: PieSectorShapeProps) {
  if (!props.isActive) {
    return <Sector {...props} />
  }

  const { innerRadius, outerRadius } = props
  const scale = 1.1

  return (
    <Sector
      {...props}
      innerRadius={(innerRadius as number) * scale}
      outerRadius={(outerRadius as number) * scale}
    />
  )
}

interface ReportPieChartProps {
  config: ChartConfig
  data: ReportChartDataItem[]
  dataKey?: string
  nameKey?: string
  className?: string
}

export function ReportPieChart({
  config,
  data,
  dataKey = 'valor',
  nameKey = 'label',
  className,
}: ReportPieChartProps) {
  return (
    <ChartContainer config={config} className={cn(CHART_HEIGHT_CLASS, className)}>
      <PieChart>
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
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius="78%"
          innerRadius="48%"
          strokeWidth={2}
          paddingAngle={2}
          shape={renderPieSector}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={String(entry.fill)} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) {
                return null
              }
              const total = data.reduce((acc, item) => acc + Number(item[dataKey] ?? 0), 0)
              return (
                <PieChartTotalLabel
                  total={total}
                  cx={viewBox.cx ?? 0}
                  cy={viewBox.cy ?? 0}
                />
              )
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
