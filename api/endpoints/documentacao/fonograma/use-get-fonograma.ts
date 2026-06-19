'use client'

import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiQuery } from '@/lib/api/use-api-query'
import type { FonogramaApi } from '@/types/api/documentacao'

export function useGetFonograma(fonogramaId?: number) {
  return useApiQuery<FonogramaApi>(
    ['fonograma', fonogramaId],
    {
      method: 'GET',
      url: `/sipa-documentacao/v1/fonogramas/${fonogramaId}`,
    },
    {
      enabled: Boolean(fonogramaId),
      onError: handleMutationError,
    },
  )
}
