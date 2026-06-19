import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation } from '@/lib/api/use-api-mutation'

export type ObraMusicalArquivoTipo = 'letra' | 'contrato' | 'audio'

type UploadObraArquivoInput = {
  obraId: number
  tipo: ObraMusicalArquivoTipo
  arquivo: File
}

function buildFormData(arquivo: File) {
  const formData = new FormData()
  formData.append('arquivo', arquivo)
  return formData
}

export function useUploadObraMusicalArquivo() {
  return useApiMutation<void, UploadObraArquivoInput>(
    {
      method: 'PUT',
      url: ({ obraId, tipo }) => `/sipa-documentacao/v1/obras-musicais/${obraId}/arquivos/${tipo}`,
      data: ({ arquivo }: UploadObraArquivoInput) => buildFormData(arquivo),
    },
    { onError: handleMutationError },
  )
}

type UploadPromptInput = {
  obraId: number
  elementoIagId: number
  arquivo: File
}

export function useUploadObraMusicalElementoIaPrompt() {
  return useApiMutation<void, UploadPromptInput>(
    {
      method: 'PUT',
      url: ({ obraId, elementoIagId }) =>
        `/sipa-documentacao/v1/obras-musicais/${obraId}/arquivos/elementos-ia/${elementoIagId}/prompt`,
      data: ({ arquivo }: UploadPromptInput) => buildFormData(arquivo),
    },
    { onError: handleMutationError },
  )
}
