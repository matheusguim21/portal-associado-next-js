export const SEARCH_KINDS = ['CONTENDO', 'COMECANDO', 'EXATAMENTE', 'TERMINANDO'] as const

export type SearchKind = (typeof SEARCH_KINDS)[number]

export type SortParam = `${string},${'asc' | 'desc'}`

export const SEARCH_KIND_LABELS: Record<SearchKind, string> = {
  COMECANDO: 'Começando com',
  CONTENDO: 'Contendo',
  EXATAMENTE: 'Exatamente',
  TERMINANDO: 'Terminando com',
}
