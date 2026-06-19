import 'server-only'

import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'
import { AUTH_TOKEN_COOKIE } from '@/lib/api/auth-cookie'

interface ServerTokenPayload {
  titular_id?: number
}

export async function getServerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null
}

export async function getServerTitularId(): Promise<number | undefined> {
  const token = await getServerAccessToken()
  if (!token) return undefined

  try {
    const decoded = jwtDecode<ServerTokenPayload>(token)
    return decoded.titular_id
  } catch {
    return undefined
  }
}
