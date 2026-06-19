'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useParamUpdater() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return useCallback(
    (key: string, value?: string, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      if (resetPage) params.set('page', '0')
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams],
  )
}

export function useReplaceSearchParams() {
  const router = useRouter()
  const pathname = usePathname()

  return useCallback(
    (params: URLSearchParams) => {
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router],
  )
}
