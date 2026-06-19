'use client'

import { useTitularId } from '@/hooks/use-auth'
import { isrcHabilitadoKey } from '@/lib/api/diversos-query-keys'
import { useApiQuery } from '@/lib/api/use-api-query'
import type { IsrcHabilitadoApi } from '@/types/api/documentacao'

export function useIsrcHabilitado() {
  const titularId = useTitularId()

  return useApiQuery<IsrcHabilitadoApi>(
    isrcHabilitadoKey(titularId),
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/isrc-on-line/habilitado',
    },
    { enabled: Boolean(titularId) },
  )
}
