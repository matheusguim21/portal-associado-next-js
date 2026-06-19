import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation } from '@/lib/api/use-api-mutation'
import type { TitularApi, TitularFiltro } from '@/types/api/documentacao'
import type { PaginatedResponse } from '@/types/api/paginated-response'

export function usePaginatedTitularesIntegracao() {
  return useApiMutation<PaginatedResponse<TitularApi>, TitularFiltro>(
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/integracao/titulares',
      params: (v) => ({
        pesquisa: v.pesquisa,
        id: v.id,
        nome: v.nome,
        email: v.email,
        pseudonimo: v.pseudonimo,
        cpfCnpj: v.cpfCnpj,
        celular: v.celular,
        codigoEcad: v.codigoEcad,
        codigoCae: v.codigoCae,
        codigoIpi: v.codigoIpi,
        codigoIpn: v.codigoIpn,
        situacaoCadastro: v.situacaoCadastro,
        nacional: v.nacional,
        page: v.page ?? 0,
        size: v.size ?? 10,
        sort: v.sort,
      }),
    },
    { onError: handleMutationError },
  )
}
