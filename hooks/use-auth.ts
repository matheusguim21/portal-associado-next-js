'use client'

import { useAuthStore } from '@/stores/use-auth-store'

export function useTitularId() {
  return useAuthStore((s) => s.user?.titularId)
}

export function useAuthUser() {
  return useAuthStore((s) => s.user)
}
