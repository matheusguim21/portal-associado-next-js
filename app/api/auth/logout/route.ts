import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  AUTH_REFRESH_COOKIE,
  AUTH_TOKEN_COOKIE,
  getClearAuthCookieOptions,
} from '@/lib/api/auth-cookie'
import { SERVER_AUTH_API_BASE_URL } from '@/lib/api/server-api-config'

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_TOKEN_COOKIE)?.value

  if (accessToken) {
    await fetch(`${SERVER_AUTH_API_BASE_URL}/sipa-auth/api/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }).catch(() => undefined)
  }

  const response = new NextResponse(null, { status: 204 })
  const clearOptions = getClearAuthCookieOptions()
  response.cookies.set(AUTH_TOKEN_COOKIE, '', clearOptions)
  response.cookies.set(AUTH_REFRESH_COOKIE, '', clearOptions)

  return response
}
