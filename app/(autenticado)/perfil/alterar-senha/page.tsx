'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUpdatePassword } from '@/api/endpoints/auth/use-auth-api'
import { Save, Eye, EyeOff, KeyRound } from 'lucide-react'

export default function AlterarSenhaPage() {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showAtual, setShowAtual] = useState(false)
  const [showNova, setShowNova] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const { mutate: alterarSenha, isPending } = useUpdatePassword()

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    if (novaSenha !== confirmarSenha) return
    if (novaSenha.length < 8) return
    alterarSenha(
      { senhaAtual, novaSenha },
      {
        onSuccess: () => {
          setSenhaAtual('')
          setNovaSenha('')
          setConfirmarSenha('')
        },
      },
    )
  }

  return (
    <div className="max-w-md">
      <PageHeader title="Perfil — Alterar Senha" description="Mantenha sua conta segura com uma senha forte." />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
              <KeyRound className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">Alterar senha de acesso</CardTitle>
              <CardDescription>Use ao menos 8 caracteres com letras e números.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <form onSubmit={handleSalvar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="senhaAtual">Senha atual</Label>
              <div className="relative">
                <Input
                  id="senhaAtual"
                  type={showAtual ? 'text' : 'password'}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowAtual((v) => !v)}
                  aria-label={showAtual ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showAtual ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="novaSenha">Nova senha</Label>
              <div className="relative">
                <Input
                  id="novaSenha"
                  type={showNova ? 'text' : 'password'}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                  minLength={8}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNova((v) => !v)}
                  aria-label={showNova ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showNova ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
              <div className="relative">
                <Input
                  id="confirmarSenha"
                  type={showConfirmar ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmar((v) => !v)}
                  aria-label={showConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmar ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isPending}>
                <Save className="size-4" data-icon="inline-start" />
                Alterar senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
