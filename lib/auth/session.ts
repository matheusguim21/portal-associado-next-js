import type { AuthUser } from '@/stores/use-auth-store'

export interface AuthMeResponse {
  usuario_id?: string
  usuario_fullName?: string
  email?: string
  titular_id?: string | null
  titular_cod_ecad?: string | null
  authorities?: string[]
}

export function mapAuthMeToUser(data: AuthMeResponse): AuthUser {
  return {
    id: Number(data.usuario_id),
    name: data.usuario_fullName ?? '',
    email: data.email,
    titularId: data.titular_id ? Number(data.titular_id) : undefined,
    codigoSoc: data.titular_cod_ecad ?? undefined,
    authorities: data.authorities ?? [],
  }
}
