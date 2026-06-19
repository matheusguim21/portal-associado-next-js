import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation } from '@/lib/api/use-api-mutation'
import { fonogramaFiltroToParams } from '@/lib/search/api-params'
import type { FonogramaApi, FonogramaFiltro } from '@/types/api/documentacao'
import type { PaginatedResponse } from '@/types/api/paginated-response'

export function usePaginatedFonogramas() {
  return useApiMutation<PaginatedResponse<FonogramaApi>, FonogramaFiltro>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/fonogramas',
      params: fonogramaFiltroToParams,
    },
    { onError: handleMutationError },
  )
}

export function useMeusFonogramas() {
  return useApiMutation<PaginatedResponse<FonogramaApi>, FonogramaFiltro>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/integracao/fonogramas/meus-fonogramas',
      params: fonogramaFiltroToParams,
    },
    { onError: handleMutationError },
  )
}

export function usePaginatedIntegracaoFonogramas() {
  return useApiMutation<PaginatedResponse<FonogramaApi>, FonogramaFiltro>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/integracao/fonogramas',
      params: fonogramaFiltroToParams,
    },
    { onError: handleMutationError },
  )
}
