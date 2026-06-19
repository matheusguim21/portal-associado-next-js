import { cn } from '@/lib/utils'
import { CHART_HEIGHT_CLASS } from './chart-constants'

interface ReportChartEmptyProps {
  className?: string
}

export function ReportChartEmpty({ className }: ReportChartEmptyProps) {
  return (
    <div
      className={cn(
        CHART_HEIGHT_CLASS,
        'flex items-center justify-center rounded-md border border-dashed border-border/60 bg-muted/20',
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">Sem dados para exibir</p>
    </div>
  )
}
