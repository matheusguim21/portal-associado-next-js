'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'
import { isApiError } from '@/lib/api/api-error'
import { apiClient, type ApiRequestConfig } from '@/lib/api/api-fetch'
import { getApiErrorMessage } from '@/lib/api/api-error-handler'

type ApiError = { response?: { data?: unknown } }

type UseApiQueryOptions<T> = Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'> & {
  onError?: (error: ApiError) => void
}

export function useApiQuery<T = unknown>(
  key: QueryKey,
  config: ApiRequestConfig,
  options?: UseApiQueryOptions<T>,
) {
  const { onError, ...queryOptions } = options ?? {}
  const lastErrorUpdatedAt = useRef(0)

  const query = useQuery<T, ApiError>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.request<T>(config)
      return data
    },
    ...queryOptions,
  })

  useEffect(() => {
    if (!onError || !query.isError || !query.error) return
    if (query.errorUpdatedAt === lastErrorUpdatedAt.current) return
    lastErrorUpdatedAt.current = query.errorUpdatedAt
    onError(query.error)
  }, [onError, query.error, query.errorUpdatedAt, query.isError])

  const errorMessage = useMemo(() => {
    if (!query.isError) return undefined
    return getApiErrorMessage(query.error)
  }, [query.error, query.isError])

  return {
    ...query,
    errorMessage,
    isApiError: query.error ? isApiError(query.error) : false,
  }
}
