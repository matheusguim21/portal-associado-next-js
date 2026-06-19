'use client'

import type { BiTitularReportData } from '@/api/endpoints/financeiro/bi-titular/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RepertorioSummary } from '@/components/financeiro/bi/RepertorioSummary'

interface DashboardRepertorioSectionProps {
  data: BiTitularReportData
}

export function DashboardRepertorioSection({ data }: DashboardRepertorioSectionProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-0">
        <CardTitle className="text-[15px] font-semibold">Repertório</CardTitle>
        <CardDescription className="text-[12px]">
          Resumo do repertório no período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <RepertorioSummary {...data.repertorio} />
      </CardContent>
    </Card>
  )
}
