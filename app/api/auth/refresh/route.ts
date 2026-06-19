import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  AUTH_REFRESH_COOKIE,
  AUTH_TOKEN_COOKIE,
  getAuthCookieOptions,
} from '@/lib/api/auth-cookie'
import { refreshAccessToken } from '@/lib/api/server-fetch'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(AUTH_REFRESH_COOKIE)?.value

  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token ausente.' }, { status: 401 })
  }

  const tokens = await refreshAccessToken(refreshToken)
  if (!tokens?.access_token) {
    return NextResponse.json({ message: 'Não foi possível renovar a sessão.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_TOKEN_COOKIE, tokens.access_token, getAuthCookieOptions())

  const nextRefreshToken = tokens.refresh_token ?? refreshToken
  response.cookies.set(AUTH_REFRESH_COOKIE, nextRefreshToken, getAuthCookieOptions())

  return response
}
