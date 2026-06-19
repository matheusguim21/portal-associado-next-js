'use client'

import { MoedaTicker } from '@/components/ui/moeda-ticker'

interface ReportLegendListProps {
  items: { label: string; valor: number; color?: string }[]
  total?: number
}

export function ReportLegendList({ items, total }: ReportLegendListProps) {
  const computedTotal = total ?? items.reduce((acc, item) => acc + item.valor, 0)

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: item.color ?? 'var(--primary)' }}
              />
              <span className="truncate">{item.label}</span>
            </div>
            <MoedaTicker value={item.valor} className="shrink-0 font-medium tabular-nums" />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm font-semibold">
        <span>Total</span>
        <MoedaTicker value={computedTotal} className="font-semibold tabular-nums" />
      </div>
    </div>
  )
}
