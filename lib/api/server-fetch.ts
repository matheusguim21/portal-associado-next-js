import {
  SERVER_API_BASE_URL,
  SERVER_AUTH_API_BASE_URL,
  SERVER_CLIENT_CREDENTIALS,
} from '@/lib/api/server-api-config'

export type ServerFetchTarget = 'backend' | 'auth'

export interface ServerFetchOptions extends Omit<RequestInit, 'body'> {
  target?: ServerFetchTarget
  path: string
  searchParams?: URLSearchParams
  accessToken?: string | null
  body?: BodyInit | null
  skipAuth?: boolean
}

function buildUpstreamUrl(target: ServerFetchTarget, path: string, searchParams?: URLSearchParams) {
  const baseUrl = target === 'auth' ? SERVER_AUTH_API_BASE_URL : SERVER_API_BASE_URL
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const authPrefix = target === 'auth' && !normalizedPath.startsWith('/sipa-auth') ? '/sipa-auth' : ''
  const url = new URL(`${baseUrl}${authPrefix}${normalizedPath}`)

  if (searchParams) {
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value)
    })
  }

  return url.toString()
}

function shouldCacheDiversos(method: string | undefined, path: string) {
  return method?.toUpperCase() === 'GET' && path.includes('/diversos/')
}

export async function refreshAccessToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const response = await fetch(`${SERVER_AUTH_API_BASE_URL}/sipa-auth/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${SERVER_CLIENT_CREDENTIALS}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'X-Token-Delivery': 'body',
    },
    body,
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  return response.json() as Promise<{ access_token: string; refresh_token?: string }>
}

export async function serverFetch({
  target = 'backend',
  path,
  searchParams,
  accessToken,
  body,
  skipAuth = false,
  method = 'GET',
  headers,
  ...init
}: ServerFetchOptions): Promise<Response> {
  const url = buildUpstreamUrl(target, path, searchParams)
  const requestHeaders = new Headers(headers)

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json')
  }

  if (!skipAuth && accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  const fetchInit: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    ...init,
    method,
    headers: requestHeaders,
    body,
  }

  if (shouldCacheDiversos(method, path)) {
    fetchInit.next = { revalidate: 3600, tags: ['diversos'] }
  } else {
    fetchInit.cache = 'no-store'
  }

  return fetch(url, fetchInit)
}
