type EnvMap = Record<string, string | undefined>

function getAppEnv(): string {
  return process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? 'development'
}

const API_URLS: EnvMap = {
  development: process.env.NEXT_PUBLIC_API_URL_DEV,
  staging: process.env.NEXT_PUBLIC_API_URL_STAGING,
  production: process.env.NEXT_PUBLIC_API_URL_PROD,
}

const AUTH_API_URLS: EnvMap = {
  development: process.env.NEXT_PUBLIC_AUTH_API_URL_DEV,
  staging: process.env.NEXT_PUBLIC_AUTH_API_URL_STAGING,
  production: process.env.NEXT_PUBLIC_AUTH_API_URL_PROD,
}

const env = getAppEnv()
const normalizedEnv = env === 'production' ? 'production' : env === 'staging' ? 'staging' : 'development'

export const API_BASE_URL = API_URLS[normalizedEnv] ?? 'http://localhost:8080'
export const AUTH_API_BASE_URL = AUTH_API_URLS[normalizedEnv] ?? 'http://localhost:8081'
export const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID ?? 'portal-associado'
export const CLIENT_CREDENTIALS = process.env.NEXT_PUBLIC_CLIENT_CREDENTIALS ?? ''
