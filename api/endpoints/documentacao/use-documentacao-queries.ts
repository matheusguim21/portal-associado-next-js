import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiQuery } from '@/lib/api/use-api-query'
import { useApiMutation } from '@/lib/api/use-api-mutation'
import type { PaginatedResponse } from '@/types/api/paginated-response'
import type { ColetivoApi, PoutPourritApi, TitularApi } from '@/types/api/documentacao'

export function useGetTitularIntegracao(titularId?: number) {
  return useApiQuery<TitularApi>(
    ['titular-integracao', titularId],
    {
      method: 'GET',
      url: `/sipa-documentacao/v1/integracao/titulares/${titularId}`,
    },
    { enabled: Boolean(titularId) },
  )
}

export function usePaginatedColetivos() {
  return useApiMutation<PaginatedResponse<ColetivoApi>, { nome?: string; page?: number; size?: number }>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/coletivos',
      params: (v) => ({ nome: v.nome, page: v.page ?? 0, size: v.size ?? 10 }),
    },
    { onError: handleMutationError },
  )
}

export function usePaginatedPoutPourrit() {
  return useApiMutation<PaginatedResponse<PoutPourritApi>, { titulo?: string; page?: number; size?: number }>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/pout-pourrits',
      params: (v) => ({ titulo: v.titulo, page: v.page ?? 0, size: v.size ?? 10 }),
    },
    { onError: handleMutationError },
  )
}

export function usePaginatedOcorrencias() {
  return useApiMutation<unknown, { page?: number; size?: number }>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/arquivo-repertorio',
      params: (v) => ({ page: v.page ?? 0, size: v.size ?? 10 }),
    },
    { onError: handleMutationError },
  )
}
