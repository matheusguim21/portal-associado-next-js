'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuthUser } from '@/hooks/use-auth'
import { useUpdateDisplayName } from '@/api/endpoints/auth/use-auth-api'
import { Save, UserCircle2 } from 'lucide-react'

export default function NomeExibicaoPage() {
  const user = useAuthUser()
  const [nomeExibicao, setNomeExibicao] = useState(user?.name ?? '')
  const { mutate: salvar, isPending } = useUpdateDisplayName()

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    if (!nomeExibicao.trim()) return
    salvar(nomeExibicao.trim())
  }

  return (
    <div className="max-w-md">
      <PageHeader title="Perfil — Nome de Exibição" description="Este nome aparece no rodapé da barra lateral." />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
              <UserCircle2 className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">Nome de exibição</CardTitle>
              <CardDescription>Exibido no menu lateral como identificação do usuário.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <form onSubmit={handleSalvar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nomeExibicao">Nome de exibição</Label>
              <Input
                id="nomeExibicao"
                value={nomeExibicao}
                onChange={(e) => setNomeExibicao(e.target.value)}
                maxLength={60}
                required
              />
              <p className="text-xs text-muted-foreground">{nomeExibicao.length}/60 caracteres</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isPending}>
                <Save className="size-4" data-icon="inline-start" />
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
