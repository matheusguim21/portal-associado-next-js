'use client'

import { MoedaTicker } from '@/components/ui/moeda-ticker'

interface PieChartTotalLabelProps {
  total: number
  cx: number
  cy: number
}

export function PieChartTotalLabel({ total, cx, cy }: PieChartTotalLabelProps) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan
        x={cx}
        y={cy - 8}
        className="fill-muted-foreground text-sm font-medium"
      >
        Total
      </tspan>
      <MoedaTicker
        as="tspan"
        x={cx}
        y={cy + 16}
        value={total}
        className="fill-foreground text-xl font-bold"
      />
    </text>
  )
}
