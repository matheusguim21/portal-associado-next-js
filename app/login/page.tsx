'use client'

import { useCallback, useEffect, useState } from 'react'
import { KeyRound, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import {
  authPrimaryButtonLeadClass,
  authSecondaryButtonClass,
} from '@/components/auth/auth-button-classes'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/button'
import { AUTH_API_BASE_URL } from '@/lib/api/api-config'
import { startLoginFlow } from '@/lib/auth/oauth'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

const FORGOT_PASSWORD_URL = `${AUTH_API_BASE_URL}/sipa-auth/publico/usuario/esqueceu-senha`

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload()
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  const handleLogin = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      await startLoginFlow()
    } catch (error) {
      setLoading(false)
      toast.error(error instanceof Error ? error.message : 'Não foi possível iniciar o login.')
    }
  }, [loading])

  return (
    <AuthLayout
      title="Bem-vindo à rede SOCINPRO"
      subtitle="Entrar no Portal do Associado"
    >
      <div className="flex flex-col">
        <InteractiveHoverButton
          className={authPrimaryButtonLeadClass}
          disabled={loading}
          onClick={handleLogin}
        >
          <span className="flex-1 text-center">
            {loading ? 'Redirecionando...' : 'Entrar'}
          </span>

        </InteractiveHoverButton>

        <Button
          variant="secondary"
          className={authSecondaryButtonClass}
          render={<a href={FORGOT_PASSWORD_URL} />}
        >
          <span className="flex-1 text-center">Esqueceu a senha?</span>
          <KeyRound className="size-4 shrink-0" />
        </Button>
      </div>
    </AuthLayout>
  )
}
