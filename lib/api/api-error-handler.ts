import { toast } from 'sonner'
import { isApiError, type ApiErrorResponse } from '@/lib/api/api-error'

export type { ApiErrorResponse, ApiProblemObject } from '@/lib/api/api-error'

const GENERIC_API_MESSAGES = new Set([
  'cadastro de obra musical.',
  'cadastro de fonograma.',
  'ocorreu um erro interno inesperado no sistema. tente novamente e se o problema persistir, entre em contato com o administrador do sistema.',
  'um ou mais campos estão inválidos. faça o preenchimento correto e tente novamente.',
])

function isGenericApiMessage(message: string) {
  return GENERIC_API_MESSAGES.has(message.trim().toLowerCase())
}

function getErrorData(error: unknown): ApiErrorResponse | undefined {
  if (isApiError(error)) {
    return error.response?.data
  }

  const legacyError = error as { response?: { data?: ApiErrorResponse } }
  return legacyError?.response?.data
}

function getErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error) return error.message
  return undefined
}

export function getApiErrorMessages(error: unknown): string[] {
  const data = getErrorData(error)

  const objectMessages =
    data?.objects
      ?.map((item) => item.userMessage?.trim())
      .filter((message): message is string => Boolean(message)) ?? []

  const uniqueObjectMessages = [...new Set(objectMessages)]
  if (uniqueObjectMessages.length > 0) {
    return uniqueObjectMessages
  }

  const candidates = [data?.userMessage, data?.detail, data?.title, getErrorMessage(error)]
    .map((message) => message?.trim())
    .filter((message): message is string => Boolean(message))

  const specificMessage = candidates.find((message) => !isGenericApiMessage(message))
  if (specificMessage) return [specificMessage]

  if (candidates[0]) return [candidates[0]]

  return ['Ocorreu um erro inesperado.']
}

export function getApiErrorMessage(error: unknown): string {
  return getApiErrorMessages(error)[0] ?? 'Ocorreu um erro inesperado.'
}

export function handleMutationError(error: unknown) {
  const messages = getApiErrorMessages(error)

  if (messages.length === 1) {
    toast.error(messages[0], { duration: 8000 })
    return
  }

  toast.error('Verifique os erros abaixo', {
    description: messages.map((message) => `• ${message}`).join('\n'),
    duration: 10000,
  })
}

export function handleQueryError(error: unknown) {
  handleMutationError(error)
}

export function resolveObraMusicalCadastroStepFromError(error: unknown): number | null {
  const data = getErrorData(error)
  const haystack = [
    data?.userMessage,
    data?.detail,
    ...(data?.objects?.map((item) => item.name) ?? []),
    ...(data?.objects?.map((item) => item.userMessage) ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (!haystack) return null

  if (haystack.includes('subtitulo') || haystack.includes('tipotitulo') || haystack.includes('tipo titulo')) {
    return 2
  }
  if (haystack.includes('titular') || haystack.includes('percentual') || haystack.includes('subcategoria')) {
    return 1
  }
  if (haystack.includes('referencia') || haystack.includes('categoria')) {
    return 3
  }
  if (
    haystack.includes('elemento') ||
    haystack.includes('usoia') ||
    haystack.includes('uso ia') ||
    haystack.includes('linkaudio') ||
    haystack.includes('tpusoia')
  ) {
    return 4
  }

  return 0
}
