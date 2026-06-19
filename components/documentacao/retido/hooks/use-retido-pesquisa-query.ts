'use client'

import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiQuery } from '@/lib/api/use-api-query'
import { useParamUpdater } from '@/hooks/use-param-updater'
import {
  buildRetidoPesquisaParams,
  canRunRetidoPesquisa,
  retidoTableSortColumn,
  type RetidoPesquisaFiltroUrl,
} from '@/lib/retido-pesquisa'
import type {
  RetAutModel,
  RetConModel,
  RetidoPesquisaQuery,
  RetidoTab,
  RetTitModel,
} from '@/types/api/documentacao/retido'
import type { SortParam } from '@/types/api/search'
import type { PaginatedResponse } from '@/types/api/paginated-response'

const RETIDO_PESQUISA_QUERY_KEY = 'retido-pesquisa' as const

interface UseRetidoPesquisaQueryParams {
  tab: RetidoTab
  appliedFiltro: RetidoPesquisaFiltroUrl
  searchRequestId: number
  page: number
  size: number
  sortParam: SortParam | null
  searchParams: URLSearchParams
  setSearchParams: (params: URLSearchParams) => void
}

export function useRetidoPesquisaQuery({
  tab,
  appliedFiltro,
  searchRequestId,
  page,
  size,
  sortParam,
  searchParams,
  setSearchParams,
}: UseRetidoPesquisaQueryParams) {
  const queryClient = useQueryClient()
  const updateParam = useParamUpdater()

  const canFetch = searchRequestId > 0 && canRunRetidoPesquisa(tab, appliedFiltro)

  const queryPayload: RetidoPesquisaQuery = useMemo(
    () => ({
      page,
      size,
      sort: sortParam ?? undefined,
      retidoOrdenacao1: appliedFiltro.retidoOrdenacao1,
      pesquisa1: appliedFiltro.pesquisa1,
      texto1: appliedFiltro.texto1,
      concatenacaoPesquisa: appliedFiltro.concatenacaoPesquisa,
      retidoOrdenacao2: appliedFiltro.retidoOrdenacao2,
      pesquisa2: appliedFiltro.pesquisa2,
      texto2: appliedFiltro.texto2,
      selecaoDigital: appliedFiltro.selecaoDigital ?? 'TODOS',
    }),
    [page, size, sortParam, appliedFiltro],
  )

  const queryParams = useMemo(
    () => buildRetidoPesquisaParams(queryPayload, tab),
    [queryPayload, tab],
  )

  const queryOptions = useMemo(
    () => ({
      enabled: canFetch,
      staleTime: 1000 * 60 * 5,
      onError: handleMutationError,
    }),
    [canFetch],
  )

  const autoralQuery = useApiQuery<PaginatedResponse<RetAutModel>>(
    [RETIDO_PESQUISA_QUERY_KEY, 'autoral', searchRequestId, queryPayload],
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/retidos/pesquisa/autoral',
      params: queryParams,
    },
    { ...queryOptions, enabled: canFetch && tab === 'autoral' },
  )

  const conexoQuery = useApiQuery<PaginatedResponse<RetConModel>>(
    [RETIDO_PESQUISA_QUERY_KEY, 'conexo', searchRequestId, queryPayload],
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/retidos/pesquisa/conexo',
      params: queryParams,
    },
    { ...queryOptions, enabled: canFetch && tab === 'conexo' },
  )

  const titularQuery = useApiQuery<PaginatedResponse<RetTitModel>>(
    [RETIDO_PESQUISA_QUERY_KEY, 'titular', searchRequestId, queryPayload],
    {
      method: 'GET',
      url: '/sipa-documentacao/v1/retidos/pesquisa/titular',
      params: queryParams,
    },
    { ...queryOptions, enabled: canFetch && tab === 'titular' },
  )

  const activeQuery =
    tab === 'autoral' ? autoralQuery : tab === 'titular' ? titularQuery : conexoQuery

  const data = canFetch ? activeQuery.data : undefined
  const isPending = canFetch && (activeQuery.isPending || activeQuery.isFetching)

  const resetAll = useCallback(() => {
    queryClient.removeQueries({ queryKey: [RETIDO_PESQUISA_QUERY_KEY] })
  }, [queryClient])

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParam('page', String(newPage), false)
    },
    [updateParam],
  )

  const handleSizeChange = useCallback(
    (newSize: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('size', String(newSize))
      params.set('page', '0')
      setSearchParams(params)
    },
    [searchParams, setSearchParams],
  )

  const handleSort = useCallback(
    (columnId: string) => {
      if (!canFetch) return
      const next = retidoTableSortColumn(columnId, sortParam)
      const params = new URLSearchParams(searchParams.toString())
      if (next === undefined) params.delete('sort')
      else params.set('sort', next)
      params.set('page', '0')
      setSearchParams(params)
    },
    [canFetch, sortParam, searchParams, setSearchParams],
  )

  return {
    canFetch,
    data,
    isPending,
    resetAll,
    handlePageChange,
    handleSizeChange,
    handleSort,
  }
}
