import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_TOKEN_COOKIE } from '@/lib/api/auth-cookie'

const publicPaths = ['/login', '/cadastro', '/recuperar-senha', '/auth/callback']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value

  if (!isPublic && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublic && token && pathname === '/login') {
    return NextResponse.redirect(new URL('/inicio', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
