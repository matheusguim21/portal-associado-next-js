'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_API_BASE_URL } from '@/lib/api/api-config'

const AUTH_RETURN_TO_KEY = 'auth:returnTo'
const AUTH_STORAGE_KEY = 'portal-auth-user'
const AUTH_STORAGE_VERSION = 2

export interface AuthUser {
  id: number
  name: string
  email?: string
  titularId?: number
  codigoSoc?: string
  authorities: string[]
}

interface AuthState {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  logout: (redirect?: boolean) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: async (redirect) => {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        }).catch(() => undefined)

        set({ user: null })

        if (redirect) {
          sessionStorage.removeItem(AUTH_RETURN_TO_KEY)
          window.location.href = `${AUTH_API_BASE_URL}/sipa-auth/logout`
        }
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      version: AUTH_STORAGE_VERSION,
      migrate: (persisted) => {
        const state = persisted as { user?: AuthUser & { access_token?: string; refresh_token?: string } }
        if (!state?.user) return { user: null }

        const { access_token: _access, refresh_token: _refresh, ...profile } = state.user as AuthUser & {
          access_token?: string
          refresh_token?: string
        }

        return { user: profile as AuthUser }
      },
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

export { AUTH_RETURN_TO_KEY, AUTH_STORAGE_KEY }
