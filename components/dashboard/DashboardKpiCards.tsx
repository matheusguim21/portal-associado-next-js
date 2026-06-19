'use client'

import { TrendingUp, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MoedaTicker } from '@/components/ui/moeda-ticker'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardKpiCardsProps {
  totalGeral?: number
  saldo?: number
  irrf?: number
  ano: number
  loadingBi?: boolean
  loadingSaldo?: boolean
}

export function DashboardKpiCards({
  totalGeral,
  saldo,
  irrf,
  ano,
  loadingBi,
  loadingSaldo,
}: DashboardKpiCardsProps) {
  const kpis = [
    {
      label: 'Total recebido (ano)',
      value: totalGeral ?? 0,
      sub: `Referência ${ano}`,
      icon: TrendingUp,
      loading: loadingBi,
    },
    {
      label: 'Saldo SOCINPRO',
      value: saldo ?? 0,
      icon: FileText,
      loading: loadingSaldo,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} className="border-border/60">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="rounded-lg bg-primary/8 p-2 w-fit">
                <Icon className="size-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {kpi.loading ? (
                <Skeleton className="h-8 w-36 mb-1" />
              ) : (
                <p className="text-2xl font-semibold text-foreground tabular-nums">
                  <MoedaTicker value={kpi.value} className="text-2xl font-semibold text-foreground" />
                </p>
              )}
              <p className="text-[12px] font-medium text-foreground/80 mt-0.5">{kpi.label}</p>
              {kpi.label === 'Saldo SOCINPRO' ? (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {loadingSaldo ? (
                    'Carregando...'
                  ) : (
                    <>
                      IRRF:{' '}
                      <MoedaTicker
                        value={irrf ?? 0}
                        className="text-[11px] font-normal text-muted-foreground"
                      />
                    </>
                  )}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.sub}</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
