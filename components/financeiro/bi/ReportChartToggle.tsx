import { ChartArea, ChartBar, ChartPie } from 'lucide-react'
import type { ReportChartType } from '@/api/endpoints/financeiro/bi-titular/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ReportChartToggleProps {
  value: ReportChartType
  onChange: (value: ReportChartType) => void
  disableArea?: boolean
  className?: string
}

const OPTIONS: { type: ReportChartType; label: string; icon: typeof ChartPie }[] = [
  { type: 'pie', label: 'Pizza', icon: ChartPie },
  { type: 'bar', label: 'Barras', icon: ChartBar },
  { type: 'area', label: 'Área', icon: ChartArea },
]

export function ReportChartToggle({
  value,
  onChange,
  disableArea = false,
  className,
}: ReportChartToggleProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {OPTIONS.map(({ type, label, icon: Icon }) => {
        const disabled = type === 'area' && disableArea
        return (
          <Button
            key={type}
            type="button"
            size="sm"
            variant={value === type ? 'default' : 'outline'}
            disabled={disabled}
            onClick={() => onChange(type)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        )
      })}
    </div>
  )
}
