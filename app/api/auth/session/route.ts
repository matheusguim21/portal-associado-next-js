import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_TOKEN_COOKIE } from '@/lib/api/auth-cookie'
import { mapAuthMeToUser, type AuthMeResponse } from '@/lib/auth/session'
import { serverFetch } from '@/lib/api/server-fetch'

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 })
  }

  const upstream = await serverFetch({
    target: 'auth',
    path: '/auth/me',
    accessToken,
  })

  if (!upstream.ok) {
    return NextResponse.json({ message: 'Sessão inválida.' }, { status: upstream.status })
  }

  const data = (await upstream.json()) as AuthMeResponse
  return NextResponse.json(mapAuthMeToUser(data))
}
