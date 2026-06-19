import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation, useApiMutationWithResponse } from '@/lib/api/use-api-mutation'
import { useApiQuery } from '@/lib/api/use-api-query'
import type {
  DemonstrativoEcadApi,
  DemonstrativoSocApi,
  EstatisticaCategoriaApi,
  EstatisticaOrigemApi,
  EstatisticaOrigemMensalApi,
  EstatisticaRubricaApi,
  EstatisticaTopObraApi,
  SocImpostoResumoApi,
  SocMutuoResumoApi,
  SocSaldoApi,
} from '@/types/api/documentacao'

export function useGetDemonstrativosEcad() {
  return useApiMutation<DemonstrativoEcadApi[], { periodo?: string; grupo?: string }>(
    {
      method: 'GET',
      url: '/sipa-financeiro/v1/ecad/demonstrativos',
      params: (v) => ({ periodo: v.periodo, grupo: v.grupo }),
    },
    { onError: handleMutationError },
  )
}

export function useDownloadDemonstrativoEcadPdf() {
  return useApiMutationWithResponse<Blob, { periodo: string; grupo?: string }>(
    {
      method: 'GET',
      url: '/sipa-financeiro/v1/ecad/demonstrativos',
      params: (v) => ({ periodo: v.periodo, grupo: v.grupo }),
      responseType: 'blob',
    },
    { onError: handleMutationError },
  )
}

export function useGetDemonstrativosSoc() {
  return useApiMutation<
    DemonstrativoSocApi[],
    { titularId: number; periodoInicial: string; periodoFinal: string }
  >(
    {
      method: 'GET',
      url: '/sipa-financeiro/v1/soc/demonstrativos',
      params: (v) => ({
        titularId: v.titularId,
        periodoInicial: v.periodoInicial,
        periodoFinal: v.periodoFinal,
      }),
    },
    { onError: handleMutationError },
  )
}

export function useGetSaldoTitular(titularId?: number) {
  return useApiQuery<SocSaldoApi>(
    ['soc-saldo', titularId],
    {
      method: 'GET',
      url: `/sipa-financeiro/v1/soc/demonstrativos/titular/${titularId}/saldo`,
    },
    { enabled: Boolean(titularId) },
  )
}

export function useGetEstatisticaOrigemAnual(titularId?: number, ano?: number) {
  return useApiQuery<EstatisticaOrigemApi[]>(
    ['stat-origem-anual', titularId, ano],
    {
      method: 'GET',
      url: '/sipa-financeiro/v1/statistica/origem-anual',
      params: { titularId, ano },
    },
    { enabled: Boolean(titularId && ano) },
  )
}

export function useGetEstatisticaCategoriaAnual(titularId?: number, ano?: number) {
  return useApiQuery<EstatisticaCategoriaApi[]>(
    ['stat-categoria-anual', titularId, ano],
    {
      method: 'GET',
      url: '/sipa-financeiro/v1/statistica/categoria-anual',
      params: { titularId, ano },
    },
    { enabled: Boolean(titularId && ano) },
  )
}

export function useGetEstatisticaRubricaAnual(titularId?: number, ano?: number) {
  return useApiQuery<EstatisticaRubricaApi[]>(
    ['stat-rubrica-anual', titularId, ano],
    {
      method: 'GET',
      url: '/sipa-financeiro/v1/statistica/rubrica-anual',
      params: { titularId, ano },
    },
    { enabled: Boolean(titularId && ano) },
  )
}

export function useGetEstatisticaTopObmFonAnual(titularId?: number, ano?: number) {
  return useApiQuery<EstatisticaTopObraApi[]>(
    ['stat-top-obm-fon', titularId, ano],
    {
      method: 'GET',
      url: '/sipa-financeiro/v1/statistica/top-obm-fon-anual',
      params: { titularId, ano },
    },
    { enabled: Boolean(titularId && ano) },
  )
}

export function useGetEstatisticaOrigemTodosMeses(titularId?: number, ano?: number) {
  return useApiQuery<EstatisticaOrigemMensalApi[]>(
    ['stat-origem-meses', titularId, ano],
    {
      method: 'GET',
      url: '/sipa-financeiro/v1/statistica/origem-anual-todos-meses',
      params: { titularId, ano },
    },
    { enabled: Boolean(titularId && ano) },
  )
}

export function useGetMutuoResumo(titularId?: number) {
  return useApiQuery<SocMutuoResumoApi>(
    ['mutuo-resumo', titularId],
    {
      method: 'GET',
      url: `/sipa-financeiro/v1/soc/portal/mutuo/titular/${titularId}/resumo`,
    },
    { enabled: Boolean(titularId) },
  )
}

export function useGetImpostoResumo(titularId?: number) {
  return useApiQuery<SocImpostoResumoApi>(
    ['imposto-resumo', titularId],
    {
      method: 'GET',
      url: `/sipa-financeiro/v1/soc/portal/imposto/titular/${titularId}/resumo`,
    },
    { enabled: Boolean(titularId) },
  )
}
