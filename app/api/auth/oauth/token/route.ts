import { NextResponse, type NextRequest } from 'next/server'
import {
  AUTH_REFRESH_COOKIE,
  AUTH_TOKEN_COOKIE,
  getAuthCookieOptions,
} from '@/lib/api/auth-cookie'
import { SERVER_AUTH_API_BASE_URL, SERVER_CLIENT_CREDENTIALS } from '@/lib/api/server-api-config'

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? ''
  const rawBody = await request.text()

  const response = await fetch(`${SERVER_AUTH_API_BASE_URL}/sipa-auth/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${SERVER_CLIENT_CREDENTIALS}`,
      'Content-Type': contentType || 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'X-Token-Delivery': 'body',
    },
    body: rawBody,
    cache: 'no-store',
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    return NextResponse.json(data ?? { message: 'Falha na autenticação.' }, { status: response.status })
  }

  const nextResponse = NextResponse.json({ ok: true }, { status: 200 })

  if (data?.access_token) {
    nextResponse.cookies.set(AUTH_TOKEN_COOKIE, data.access_token, getAuthCookieOptions())
  }

  if (data?.refresh_token) {
    nextResponse.cookies.set(AUTH_REFRESH_COOKIE, data.refresh_token, getAuthCookieOptions())
  }

  return nextResponse
}
