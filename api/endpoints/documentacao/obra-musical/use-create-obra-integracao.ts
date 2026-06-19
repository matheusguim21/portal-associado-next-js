import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation } from '@/lib/api/use-api-mutation'
import type { ObraMusicalApi } from '@/types/api/documentacao'

export type ObraMusicalIntegracaoPayload = {
  obraMusical: {
    titulo: string
    nacional: 'S' | 'N'
    instrumental: 'S' | 'N'
    duracao?: string
  }
  titularAdministrado: { id: number }
}

export function useCreateObraIntegracao() {
  return useApiMutation<ObraMusicalApi, ObraMusicalIntegracaoPayload>(
    {
      method: 'POST',
      url: '/sipa-documentacao/v1/integracao/obras-musicais',
      data: (v: ObraMusicalIntegracaoPayload) => v,
    },
    { onError: handleMutationError },
  )
}
