export const AUTH_TOKEN_COOKIE = 'portal-auth-token'
export const AUTH_REFRESH_COOKIE = 'portal-auth-refresh'

export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 8

export function getAuthCookieOptions(maxAge = AUTH_COOKIE_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
    secure: process.env.NODE_ENV === 'production',
  }
}

export function getClearAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production',
  }
}
