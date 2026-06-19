'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { handleOAuthCallback } from '@/lib/auth/oauth-callback'
import { useAuthStore } from '@/stores/use-auth-store'

export default function AuthCallbackPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('logout') === 'true') {
      void logout(false)
    }

    handleOAuthCallback(setUser, (path) => router.replace(path))
  }, [setUser, logout, router])

  return (
    <AuthLayout showCard={false} showLogo={false}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-foreground">Autenticando...</p>
      </div>
    </AuthLayout>
  )
}
