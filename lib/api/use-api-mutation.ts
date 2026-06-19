'use client'

import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { apiClient, type ApiRequestConfig, type ApiResponse } from '@/lib/api/api-fetch'

interface DynamicApiRequestConfig<TVariables>
  extends Omit<ApiRequestConfig, 'url' | 'data' | 'params'> {
  url: string | ((variables: TVariables) => string)
  data?: unknown | ((variables: TVariables) => unknown)
  params?: Record<string, unknown> | ((variables: TVariables) => Record<string, unknown>)
  sendBody?: boolean
}

export function useApiMutation<T = unknown, TVariables = void, TContext = unknown>(
  config: DynamicApiRequestConfig<TVariables>,
  options?: Omit<UseMutationOptions<T, unknown, TVariables, TContext>, 'mutationFn'>,
) {
  return useMutation<T, unknown, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      const { sendBody: sendBodyOpt, ...requestConfig } = config
      const resolvedUrl =
        typeof requestConfig.url === 'function' ? requestConfig.url(variables) : requestConfig.url
      const isGet = requestConfig.method?.toUpperCase() === 'GET'

      const requestData =
        typeof requestConfig.data === 'function' ? requestConfig.data(variables) : requestConfig.data

      const resolvedParams =
        typeof requestConfig.params === 'function'
          ? requestConfig.params(variables)
          : requestConfig.params

      const sendBody = sendBodyOpt !== false

      const { data } = await apiClient.request<T>({
        ...requestConfig,
        url: resolvedUrl,
        ...(isGet
          ? { params: resolvedParams ?? (requestData as Record<string, unknown>) ?? variables }
          : sendBody
            ? { data: requestData ?? variables }
            : {}),
      })
      return data
    },
    ...options,
  })
}

export function useApiMutationWithResponse<T = unknown, TVariables = void, TContext = unknown>(
  config: DynamicApiRequestConfig<TVariables>,
  options?: Omit<UseMutationOptions<ApiResponse<T>, unknown, TVariables, TContext>, 'mutationFn'>,
) {
  return useMutation<ApiResponse<T>, unknown, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      const { sendBody: sendBodyOpt, ...requestConfig } = config
      const resolvedUrl =
        typeof requestConfig.url === 'function' ? requestConfig.url(variables) : requestConfig.url
      const isGet = requestConfig.method?.toUpperCase() === 'GET'

      const requestData =
        typeof requestConfig.data === 'function' ? requestConfig.data(variables) : requestConfig.data

      const resolvedParams =
        typeof requestConfig.params === 'function'
          ? requestConfig.params(variables)
          : requestConfig.params

      const sendBody = sendBodyOpt !== false

      return apiClient.request<T>({
        ...requestConfig,
        url: resolvedUrl,
        responseType: requestConfig.responseType ?? 'blob',
        ...(isGet
          ? { params: resolvedParams ?? (requestData as Record<string, unknown>) ?? variables }
          : sendBody
            ? { data: requestData ?? variables }
            : {}),
      })
    },
    ...options,
  })
}
