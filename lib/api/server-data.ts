import 'server-only'

import { getServerAccessToken } from '@/lib/auth/server-auth'
import { serverFetch } from '@/lib/api/server-fetch'
import type { FonogramaFiltro, ObraMusicalFiltro } from '@/types/api/documentacao'
import type { PaginatedResponse } from '@/types/api/paginated-response'
import { fonogramaFiltroToParams, obraFiltroToParams } from '@/lib/search/api-params'

type SearchParamValue = string | number | boolean | undefined | null

function toSearchParams(params: Record<string, SearchParamValue>) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    searchParams.set(key, String(value))
  })

  return searchParams.size > 0 ? searchParams : undefined
}

export async function serverFetchJson<T>(
  path: string,
  options?: {
    searchParams?: Record<string, SearchParamValue>
    auth?: boolean
  },
): Promise<T> {
  const accessToken = options?.auth === false ? null : await getServerAccessToken()
  const response = await serverFetch({
    path,
    accessToken,
    searchParams: options?.searchParams ? toSearchParams(options.searchParams) : undefined,
  })

  if (!response.ok) {
    throw new Error(`Falha ao buscar ${path}: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchMeusObrasServer(filter: ObraMusicalFiltro) {
  return serverFetchJson<PaginatedResponse<import('@/types/api/documentacao').ObraMusicalApi>>(
    '/sipa-documentacao/v1/obras-musicais',
    { searchParams: obraFiltroToParams(filter) },
  )
}

export async function fetchMeusFonogramasServer(filter: FonogramaFiltro) {
  return serverFetchJson<PaginatedResponse<import('@/types/api/documentacao').FonogramaApi>>(
    '/sipa-documentacao/v1/integracao/fonogramas/meus-fonogramas',
    { searchParams: fonogramaFiltroToParams(filter) },
  )
}

export async function fetchIsrcHabilitadoServer() {
  return serverFetchJson<{ habilitado: boolean }>(
    '/sipa-documentacao/v1/isrc-on-line/habilitado',
  )
}
