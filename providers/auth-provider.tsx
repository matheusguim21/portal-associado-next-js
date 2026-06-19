'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import type { AuthUser } from '@/stores/use-auth-store'

function clearLegacyAuthStorage() {
  try {
    const raw = localStorage.getItem('portal-auth-user')
    if (!raw) return

    const parsed = JSON.parse(raw) as { state?: { user?: { access_token?: string } } }
    if (parsed?.state?.user?.access_token) {
      localStorage.removeItem('portal-auth-user')
    }
  } catch {
    localStorage.removeItem('portal-auth-user')
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    clearLegacyAuthStorage()

    fetch('/api/auth/session', { credentials: 'include' })
      .then(async (response) => {
        if (response.ok) {
          const profile = (await response.json()) as AuthUser
          setUser(profile)
          return
        }

        if (response.status === 401) {
          setUser(null)
        }
      })
      .catch(() => undefined)
  }, [setUser])

  return children
}
