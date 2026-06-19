export interface ApiProblemObject {
  name?: string
  userMessage?: string
}

export interface ApiErrorResponse {
  userMessage?: string
  detail?: string
  title?: string
  objects?: ApiProblemObject[]
}

export class ApiError extends Error {
  status?: number
  response?: { data?: ApiErrorResponse }
  code?: string

  constructor(message: string, status?: number, data?: ApiErrorResponse, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    if (data !== undefined) {
      this.response = { data }
    }
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
