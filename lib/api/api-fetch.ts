'use client'

import { toast } from 'sonner'
import { ApiError } from '@/lib/api/api-error'
import type { ApiErrorResponse } from '@/lib/api/api-error'
import { useAuthStore } from '@/stores/use-auth-store'

export const API_BACKEND_BASE_URL = '/api/backend'
export const API_AUTH_BASE_URL = '/api/auth'

export interface ApiRequestConfig {
  url?: string
  method?: string
  baseURL?: string
  params?: Record<string, unknown>
  data?: unknown
  headers?: Record<string, string>
  responseType?: 'json' | 'blob'
  _retry?: boolean
}

export interface ApiResponse<T> {
  data: T
  status: number
  headers: Record<string, string>
}

let isRefreshing = false
let failedQueue: {
  resolve: () => void
  reject: (error: unknown) => void
}[] = []

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve()
  })
  failedQueue = []
}

function buildUrl(baseURL: string, url: string, params?: Record<string, unknown>) {
  const normalizedBase = baseURL.replace(/\/$/, '')
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  const target = new URL(`${normalizedBase}${normalizedUrl}`, window.location.origin)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (Array.isArray(value)) {
        value.forEach((item) => target.searchParams.append(key, String(item)))
        return
      }
      target.searchParams.append(key, String(value))
    })
  }

  return target.pathname + target.search
}

function headersToRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {}
  headers.forEach((value, key) => {
    record[key] = value
  })
  return record
}

async function parseErrorResponse(response: Response): Promise<ApiErrorResponse | undefined> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json().catch(() => undefined)
  }
  return undefined
}

async function refreshSession() {
  const response = await fetch(`${API_AUTH_BASE_URL}/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new ApiError('Não foi possível renovar a sessão.', response.status)
  }
}

async function executeRequest<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
  const {
    baseURL = API_BACKEND_BASE_URL,
    url = '',
    method = 'GET',
    params,
    data,
    headers = {},
    responseType = 'json',
    _retry = false,
  } = config

  const requestHeaders = new Headers(headers)
  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json')
  }

  let body: BodyInit | undefined
  const isGet = method.toUpperCase() === 'GET' || method.toUpperCase() === 'HEAD'

  if (!isGet && data !== undefined) {
    if (data instanceof FormData) {
      body = data
    } else {
      if (!requestHeaders.has('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/json')
      }
      body = JSON.stringify(data)
    }
  }

  const response = await fetch(buildUrl(baseURL, url, isGet ? params : undefined), {
    method,
    credentials: 'include',
    headers: requestHeaders,
    body,
  })

  if (response.status === 401 && !_retry) {
    if (isRefreshing) {
      await new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
      return executeRequest<T>({ ...config, _retry: true })
    }

    isRefreshing = true
    try {
      await refreshSession()
      processQueue(null)
      return executeRequest<T>({ ...config, _retry: true })
    } catch (error) {
      processQueue(error)
      useAuthStore.getState().logout()
      throw error
    } finally {
      isRefreshing = false
    }
  }

  if (!response.ok) {
    const errorData = await parseErrorResponse(response)
    const error = new ApiError(
      errorData?.userMessage ?? errorData?.detail ?? errorData?.title ?? response.statusText,
      response.status,
      errorData,
    )

    if (response.status === 500) {
      toast.error('Erro no servidor. Tente novamente mais tarde.')
    }

    throw error
  }

  const responseHeaders = headersToRecord(response.headers)
  const responseData =
    responseType === 'blob' ? ((await response.blob()) as T) : ((await response.json()) as T)

  return {
    data: responseData,
    status: response.status,
    headers: responseHeaders,
  }
}

export async function apiRequest<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
  try {
    return await executeRequest<T>(config)
  } catch (error) {
    if (error instanceof TypeError) {
      toast.error('Erro de conexão com a API.')
      throw new ApiError('Erro de conexão com a API.', undefined, undefined, 'ERR_NETWORK')
    }
    throw error
  }
}

export const apiClient = {
  request: apiRequest,
  get<T = unknown>(url: string, config?: Omit<ApiRequestConfig, 'url' | 'method'>) {
    return apiRequest<T>({ ...config, url, method: 'GET' })
  },
  post<T = unknown>(url: string, data?: unknown, config?: Omit<ApiRequestConfig, 'url' | 'method' | 'data'>) {
    return apiRequest<T>({ ...config, url, method: 'POST', data })
  },
  put<T = unknown>(url: string, data?: unknown, config?: Omit<ApiRequestConfig, 'url' | 'method' | 'data'>) {
    return apiRequest<T>({ ...config, url, method: 'PUT', data })
  },
  patch<T = unknown>(url: string, data?: unknown, config?: Omit<ApiRequestConfig, 'url' | 'method' | 'data'>) {
    return apiRequest<T>({ ...config, url, method: 'PATCH', data })
  },
  delete<T = unknown>(url: string, config?: Omit<ApiRequestConfig, 'url' | 'method'>) {
    return apiRequest<T>({ ...config, url, method: 'DELETE' })
  },
}

export const authApiClient = {
  request<T = unknown>(config: ApiRequestConfig) {
    return apiRequest<T>({ ...config, baseURL: API_AUTH_BASE_URL })
  },
  get<T = unknown>(url: string, config?: Omit<ApiRequestConfig, 'url' | 'method' | 'baseURL'>) {
    return apiRequest<T>({ ...config, baseURL: API_AUTH_BASE_URL, url, method: 'GET' })
  },
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiRequestConfig, 'url' | 'method' | 'data' | 'baseURL'>,
  ) {
    return apiRequest<T>({ ...config, baseURL: API_AUTH_BASE_URL, url, method: 'PUT', data })
  },
}
