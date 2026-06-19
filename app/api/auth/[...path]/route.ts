import { createProxyHandlers } from '@/lib/api/proxy-handler'

export const { GET, POST, PUT, PATCH, DELETE } = createProxyHandlers('auth')
