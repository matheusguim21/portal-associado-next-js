'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, CheckCircle2, LogIn, User } from 'lucide-react'
import { useRecuperarSenha } from '@/api/endpoints/auth/use-auth-api'
import {
  authPrimaryButtonClass,
  authPrimaryButtonLeadClass,
  authSecondaryButtonClass,
} from '@/components/auth/auth-button-classes'
import { AuthInputGroup } from '@/components/auth/AuthInputGroup'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function RecuperarSenhaPage() {
  const [usuario, setUsuario] = useState('')
  const [enviado, setEnviado] = useState(false)
  const { mutate: recuperar, isPending } = useRecuperarSenha()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    recuperar(usuario, { onSuccess: () => setEnviado(true) })
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe seu usuário para receber as instruções"
    >
      {enviado ? (
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
            <CheckCircle2 className="size-6 text-white" />
          </div>
          <p className="text-sm font-medium text-[#fafafa]">Instruções enviadas!</p>
          <p className="text-xs text-[rgba(250,250,250,0.85)]">
            Verifique o e-mail cadastrado na SOCINPRO.
          </p>
          <Button
            className={cn(authPrimaryButtonClass, 'mt-2')}
            render={<Link href="/login" />}
          >
            <span className="flex-1 text-center">Voltar para o login</span>
            <LogIn className="size-4 shrink-0" />
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col">
          <AuthInputGroup
            id="usuario"
            icon={<User className="size-4" />}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Seu nome de usuário"
            maxLength={30}
            required
            autoComplete="username"
          />

          <Button
            type="submit"
            className={authPrimaryButtonLeadClass}
            disabled={isPending}
          >
            <span className="flex-1 text-center">
              {isPending ? 'Enviando...' : 'Recuperar senha'}
            </span>
            <LogIn className="size-4 shrink-0" />
          </Button>

          <Button
            variant="outline"
            className={authSecondaryButtonClass}
            render={<Link href="/login" />}
          >
            <span className="flex-1 text-center">Voltar para o login</span>
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
