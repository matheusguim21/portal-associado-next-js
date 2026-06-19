'use client'

import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { User } from 'lucide-react'
import { useGetTitularIntegracao } from '@/api/endpoints/documentacao/use-documentacao-queries'
import { useAuthUser } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'

export default function DadosCadastraisPage() {
  const user = useAuthUser()
  const { data: titular, isLoading } = useGetTitularIntegracao(user?.titularId)

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader
        title="Perfil — Dados Cadastrais"
        description="Visualize seus dados cadastrais de titular."
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
              <User className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">{user?.name ?? '—'}</CardTitle>
              <CardDescription>
                Associado SOCINPRO — Cód. {user?.codigoSoc ?? titular?.codigoEcad ?? '—'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Nome</Label>
                <Input value={titular?.nome ?? user?.name ?? ''} disabled className="bg-muted" readOnly />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>E-mail</Label>
                <Input value={titular?.email ?? user?.email ?? ''} disabled className="bg-muted" readOnly />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Código ECAD</Label>
                <Input
                  value={titular?.codigoEcad?.toString() ?? user?.codigoSoc ?? ''}
                  disabled
                  className="bg-muted"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>CPF/CNPJ</Label>
                <Input value={titular?.cpfCnpj ?? ''} disabled className="bg-muted" readOnly />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
