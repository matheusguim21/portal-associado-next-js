import { AUTH_API_BASE_URL, CLIENT_ID } from '@/lib/api/api-config'
import { OAUTH_SCOPES } from '@/lib/auth/oauth-scopes'

const generateCodeVerifier = () => {
  const array = new Uint32Array(56 / 2)
  crypto.getRandomValues(array)
  return Array.from(array, (dec) => dec.toString(16).padStart(2, '0')).join('')
}

const base64UrlEncode = (str: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

export const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}

export const startLoginFlow = async () => {
  try {
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    sessionStorage.setItem('pkce_verifier', verifier)

    const redirectUri = `${window.location.origin}/auth/callback`
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      scope: OAUTH_SCOPES.join(' '),
    })

    window.location.assign(`${AUTH_API_BASE_URL}/sipa-auth/oauth2/authorize?${params}`)
  } catch {
    throw new Error('Não foi possível iniciar o login. Recarregue a página e tente novamente.')
  }
}
