'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useGetSaldoTitular,
  useGetMutuoResumo,
  useGetImpostoResumo,
} from '@/api/endpoints/financeiro/use-financeiro-queries'
import { useTitularId } from '@/hooks/use-auth'
import { ArrowRight } from 'lucide-react'

import { formatarMoeda } from '@/lib/format'

export default function SocinproResumoPage() {
  const titularId = useTitularId()
  const { data: saldo, isLoading: loadingSaldo } = useGetSaldoTitular(titularId)
  const { data: mutuo, isLoading: loadingMutuo } = useGetMutuoResumo(titularId)
  const { data: imposto, isLoading: loadingImposto } = useGetImpostoResumo(titularId)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Resumo Financeiro"
        description="Saldo, mútuo e informações de imposto de renda."
        actions={
          <Button variant="outline" size="sm" render={<Link href="/financeiro/socinpro/demonstrativo" />}>
            Ver demonstrativos
            <ArrowRight className="size-3.5" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saldo líquido</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {loadingSaldo ? <Skeleton className="h-8 w-32" /> : formatarMoeda(saldo?.saldo)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              IRRF estimado: {loadingSaldo ? '...' : formatarMoeda(saldo?.irrf)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mútuo</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {loadingMutuo ? <Skeleton className="h-8 w-32" /> : formatarMoeda(mutuo?.valorLiberado)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Valor liberado / saldo de mútuo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Imposto de renda</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {loadingImposto ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                imposto?.anoSugerido ?? '—'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Anos disponíveis: {imposto?.anosDisponiveis?.join(', ') ?? '—'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
