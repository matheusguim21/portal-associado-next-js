type EnvMap = Record<string, string | undefined>

function getAppEnv(): string {
  return process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? 'development'
}

function pickEnvValue(serverMap: EnvMap, publicMap: EnvMap): string | undefined {
  const env = getAppEnv()
  const normalizedEnv =
    env === 'production' ? 'production' : env === 'staging' ? 'staging' : 'development'

  return serverMap[normalizedEnv] ?? publicMap[normalizedEnv]
}

const API_URLS: EnvMap = {
  development: process.env.API_URL_DEV,
  staging: process.env.API_URL_STAGING,
  production: process.env.API_URL_PROD,
}

const API_URLS_PUBLIC: EnvMap = {
  development: process.env.NEXT_PUBLIC_API_URL_DEV,
  staging: process.env.NEXT_PUBLIC_API_URL_STAGING,
  production: process.env.NEXT_PUBLIC_API_URL_PROD,
}

const AUTH_API_URLS: EnvMap = {
  development: process.env.AUTH_API_URL_DEV,
  staging: process.env.AUTH_API_URL_STAGING,
  production: process.env.AUTH_API_URL_PROD,
}

const AUTH_API_URLS_PUBLIC: EnvMap = {
  development: process.env.NEXT_PUBLIC_AUTH_API_URL_DEV,
  staging: process.env.NEXT_PUBLIC_AUTH_API_URL_STAGING,
  production: process.env.NEXT_PUBLIC_AUTH_API_URL_PROD,
}

export const SERVER_API_BASE_URL = pickEnvValue(API_URLS, API_URLS_PUBLIC) ?? 'http://localhost:8080'
export const SERVER_AUTH_API_BASE_URL =
  pickEnvValue(AUTH_API_URLS, AUTH_API_URLS_PUBLIC) ?? 'http://localhost:8081'
export const SERVER_CLIENT_ID = process.env.CLIENT_ID ?? process.env.NEXT_PUBLIC_CLIENT_ID ?? 'portal-associado'
export const SERVER_CLIENT_CREDENTIALS =
  process.env.CLIENT_CREDENTIALS ?? process.env.NEXT_PUBLIC_CLIENT_CREDENTIALS ?? ''
