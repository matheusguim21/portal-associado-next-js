import { toast } from 'sonner'
import type { AuthUser } from '@/stores/use-auth-store'
import { AUTH_RETURN_TO_KEY } from '@/stores/use-auth-store'

export async function handleOAuthCallback(
  setUser: (user: AuthUser) => void,
  navigate: (path: string) => void,
) {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const logout = urlParams.get('logout')
  const oauthError = urlParams.get('error')
  const oauthErrorDescription = urlParams.get('error_description')
  const verifier = sessionStorage.getItem('pkce_verifier')

  if (logout) {
    sessionStorage.removeItem(AUTH_RETURN_TO_KEY)
    sessionStorage.removeItem('pkce_verifier')
    navigate('/login')
    return
  }

  if (oauthError) {
    sessionStorage.removeItem('pkce_verifier')
    toast.error(oauthErrorDescription || 'Falha na autenticação.')
    navigate('/login')
    return
  }

  if (!code || !verifier) {
    toast.error('Parâmetros de autenticação inválidos.')
    navigate('/login')
    return
  }

  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${window.location.origin}/auth/callback`,
      code_verifier: verifier,
    })

    const tokenResponse = await fetch('/api/auth/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include',
      body,
    })

    if (!tokenResponse.ok) {
      const err = await tokenResponse.json().catch(() => ({}))
      toast.error(err.error_description || 'Falha na autenticação.')
      navigate('/login')
      return
    }

    const sessionResponse = await fetch('/api/auth/session', {
      credentials: 'include',
    })

    if (!sessionResponse.ok) {
      toast.error('Não foi possível carregar a sessão.')
      navigate('/login')
      return
    }

    const profile = (await sessionResponse.json()) as AuthUser
    setUser(profile)

    toast.success('Login realizado com sucesso!')
    const returnTo = sessionStorage.getItem(AUTH_RETURN_TO_KEY)
    sessionStorage.removeItem(AUTH_RETURN_TO_KEY)
    sessionStorage.removeItem('pkce_verifier')
    navigate(returnTo || '/inicio')
  } catch {
    toast.error('Erro de rede ao autenticar.')
    navigate('/login')
  }
}
