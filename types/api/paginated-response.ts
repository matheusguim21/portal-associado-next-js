export interface PaginatedResponse<T> {
  content: T[]
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export type PageParams = {
  page?: number
  size?: number
  sort?: string
}
