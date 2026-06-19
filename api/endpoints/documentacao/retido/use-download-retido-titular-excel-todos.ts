import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutationWithResponse } from '@/lib/api/use-api-mutation'
import { downloadBlobResponse } from '@/lib/download-blob'
import {
  buildRetidoExcelTodosFiltroPayload,
  type RetidoPesquisaFiltroUrl,
} from '@/lib/retido-pesquisa'
import { RETIDO_UI_LABELS } from '@/lib/retido-labels'
import { toast } from 'sonner'

export interface RetidoExcelTodosVariables {
  appliedFiltro: RetidoPesquisaFiltroUrl
}

export function useDownloadRetidoTitularExcelTodos() {
  return useApiMutationWithResponse<Blob, RetidoExcelTodosVariables>(
    {
      method: 'POST',
      url: '/sipa-documentacao/v1/retidos/pesquisa/titular/relatorio-excel-todos',
      responseType: 'blob',
      data: ({ appliedFiltro }: RetidoExcelTodosVariables) =>
        buildRetidoExcelTodosFiltroPayload(appliedFiltro, 'titular'),
    },
    {
      onSuccess: (response) => {
        toast.success(RETIDO_UI_LABELS.toolbar.excelTodosSuccess)
        downloadBlobResponse(response.data, response.headers, 'retido_titular.xlsx')
      },
      onError: handleMutationError,
    },
  )
}
