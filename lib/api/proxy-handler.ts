import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import {
  AUTH_REFRESH_COOKIE,
  AUTH_TOKEN_COOKIE,
  getAuthCookieOptions,
} from '@/lib/api/auth-cookie'
import { refreshAccessToken, serverFetch, type ServerFetchTarget } from '@/lib/api/server-fetch'

const FORWARDED_RESPONSE_HEADERS = ['content-type', 'content-disposition', 'content-length']

function buildSearchParams(request: NextRequest) {
  return new URL(request.url).searchParams
}

function buildProxyResponse(upstream: Response) {
  const headers = new Headers()

  FORWARDED_RESPONSE_HEADERS.forEach((name) => {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  })

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  })
}

async function readErrorBody(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }

  const text = await response.text().catch(() => '')
  return text || null
}

function withAuthCookies(
  response: NextResponse,
  tokens: { access_token: string; refresh_token?: string },
) {
  response.cookies.set(AUTH_TOKEN_COOKIE, tokens.access_token, getAuthCookieOptions())

  if (tokens.refresh_token) {
    response.cookies.set(AUTH_REFRESH_COOKIE, tokens.refresh_token, getAuthCookieOptions())
  }

  return response
}

async function proxyRequest(request: NextRequest, pathSegments: string[], target: ServerFetchTarget) {
  const path = `/${pathSegments.join('/')}`
  const cookieStore = await cookies()
  let accessToken = cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null
  const refreshToken = cookieStore.get(AUTH_REFRESH_COOKIE)?.value ?? null
  const contentType = request.headers.get('content-type') ?? ''
  const isMultipart = contentType.includes('multipart/form-data')

  let body: BodyInit | null | undefined
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = isMultipart ? await request.formData() : await request.text()
  }

  const requestHeaders = new Headers()
  const accept = request.headers.get('accept')
  if (accept) requestHeaders.set('Accept', accept)
  if (!isMultipart && contentType) requestHeaders.set('Content-Type', contentType)

  let upstream = await serverFetch({
    target,
    path,
    searchParams: buildSearchParams(request),
    accessToken,
    method: request.method,
    headers: requestHeaders,
    body,
  })

  if (upstream.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken)
    if (refreshed?.access_token) {
      accessToken = refreshed.access_token
      upstream = await serverFetch({
        target,
        path,
        searchParams: buildSearchParams(request),
        accessToken,
        method: request.method,
        headers: requestHeaders,
        body,
      })

      if (upstream.ok || upstream.status !== 401) {
        const response = buildProxyResponse(upstream)
        return withAuthCookies(response, refreshed)
      }
    }
  }

  if (!upstream.ok) {
    const errorBody = await readErrorBody(upstream)
    return NextResponse.json(errorBody ?? { message: upstream.statusText }, { status: upstream.status })
  }

  return buildProxyResponse(upstream)
}

export function createProxyHandlers(target: ServerFetchTarget) {
  async function handler(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params
    return proxyRequest(request, path, target)
  }

  return {
    GET: handler,
    POST: handler,
    PUT: handler,
    PATCH: handler,
    DELETE: handler,
  }
}
