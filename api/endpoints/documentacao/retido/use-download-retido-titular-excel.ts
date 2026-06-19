import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutationWithResponse } from '@/lib/api/use-api-mutation'
import { downloadBlobResponse } from '@/lib/download-blob'

export interface RetidoExcelDownloadVariables {
  pkCodigos: string[]
}

function toNumericPkList(pkCodigos: string[]): number[] {
  return pkCodigos.map((id) => {
    const n = Number(id)
    if (!Number.isFinite(n)) throw new Error(`Código inválido: ${id}`)
    return n
  })
}

export function useDownloadRetidoTitularExcel() {
  return useApiMutationWithResponse<Blob, RetidoExcelDownloadVariables>(
    {
      method: 'POST',
      url: '/sipa-documentacao/v1/retidos/pesquisa/titular/relatorio-excel',
      responseType: 'blob',
      data: (variables: RetidoExcelDownloadVariables) => ({
        pkCodigos: toNumericPkList(variables.pkCodigos),
      }),
    },
    {
      onSuccess: (response) => {
        downloadBlobResponse(response.data, response.headers, 'retido_titular.xlsx')
      },
      onError: handleMutationError,
    },
  )
}
