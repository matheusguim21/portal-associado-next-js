import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation } from '@/lib/api/use-api-mutation'
import type { ObraMusicalApi } from '@/types/api/documentacao'

export function useGerarOcorrenciaObraMusical() {
  return useApiMutation<ObraMusicalApi, number>(
    {
      method: 'POST',
      url: (obraId) => `/sipa-documentacao/v1/obras-musicais/${obraId}/gerar-ocorrencia`,
      sendBody: false,
    },
    { onError: handleMutationError },
  )
}
