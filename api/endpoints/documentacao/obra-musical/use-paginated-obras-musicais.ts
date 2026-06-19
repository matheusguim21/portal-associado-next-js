import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation } from '@/lib/api/use-api-mutation'
import { obraFiltroToParams } from '@/lib/search/api-params'
import type { ObraMusicalApi, ObraMusicalFiltro } from '@/types/api/documentacao'
import type { PaginatedResponse } from '@/types/api/paginated-response'

export function usePaginatedObrasMusicais() {
  return useApiMutation<PaginatedResponse<ObraMusicalApi>, ObraMusicalFiltro>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/obras-musicais',
      params: obraFiltroToParams,
    },
    { onError: handleMutationError },
  )
}

export function usePaginatedIntegracaoObras() {
  return useApiMutation<PaginatedResponse<ObraMusicalApi>, ObraMusicalFiltro>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/integracao/obras-musicais',
      params: obraFiltroToParams,
    },
    { onError: handleMutationError },
  )
}

export function useMeusObras() {
  return useApiMutation<PaginatedResponse<ObraMusicalApi>, ObraMusicalFiltro>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/obras-musicais',
      params: obraFiltroToParams,
    },
    { onError: handleMutationError },
  )
}
