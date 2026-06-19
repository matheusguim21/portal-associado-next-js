import type { RetidoPesquisaQuery, RetidoTab } from '@/types/api/documentacao/retido'
import type { SortParam } from '@/types/api/search'
import {
  RETIDO_ORDENACAO_AUTOR_VALUES,
  RETIDO_ORDENACAO_CONEXO_VALUES,
  RETIDO_ORDENACAO_TITULAR_VALUES,
} from '@/types/api/documentacao/retido'

const ORDENACAO_SEM_PESQUISA_AUTOR = new Set<string>([
  'CDCAPEPI',
  'COD_AUDIO_VISUAL',
  'COD_FONOGRAMA',
  'COD_OBRA',
  'COD_POUT_POURRIT',
  'COMPETENCIA',
  'EXECUCAO_SEGUNDOS',
  'IFPI',
])

const ORDENACAO_SEM_PESQUISA_CONEXO = new Set<string>([
  'CDCAPEPI',
  'COD_AUDIO_VISUAL',
  'COD_FONOGRAMA',
  'COD_OBRA',
  'COD_POUT_POURRIT',
  'COMPETENCIA',
  'EXECUCAO_SEGUNDOS',
  'IFPI',
])

const ORDENACAO_SEM_PESQUISA_TITULAR = new Set<string>([
  'CDCAPEPI',
  'COD_AUDIO_VISUAL',
  'COD_FONOGRAMA',
  'COD_OBRA',
  'COD_POUT_POURRIT',
  'COD_TITULAR',
  'COMPETENCIA',
  'EXECUCAO_SEGUNDOS',
  'IFPI',
])

export const RETIDO_COLUMN_TO_API_SORT: Record<string, string> = {
  compet: 'competencia',
  rubrica: 'rubricaDescricao',
  pkCodigo: 'obmCodigo',
  nmObra: 'obmTitulo',
  refAutoral: 'refAutot',
  refInterprete: 'refInterprete',
}

const API_SORT_TO_COLUMN: Record<string, string> = Object.fromEntries(
  Object.entries(RETIDO_COLUMN_TO_API_SORT).map(([col, api]) => [api, col]),
)

export function retidoColumnIdToApiSort(columnId: string): string | undefined {
  return RETIDO_COLUMN_TO_API_SORT[columnId]
}

export function isRetidoColumnSortable(columnId: string): boolean {
  return columnId in RETIDO_COLUMN_TO_API_SORT
}

export function retidoUiSortToApiSort(sort: SortParam | null): SortParam | null {
  if (!sort) return null
  const [columnId, direction] = sort.split(',') as [string, 'asc' | 'desc']
  const apiProp = retidoColumnIdToApiSort(columnId)
  if (!apiProp || (direction !== 'asc' && direction !== 'desc')) return null
  return `${apiProp},${direction}`
}

export function retidoExigePesquisa1Autoral(retidoOrdenacao1: string | undefined): boolean {
  if (!retidoOrdenacao1) return true
  return !ORDENACAO_SEM_PESQUISA_AUTOR.has(retidoOrdenacao1)
}

export function retidoExigePesquisa2Autoral(retidoOrdenacao2: string | undefined): boolean {
  if (!retidoOrdenacao2) return false
  return !ORDENACAO_SEM_PESQUISA_AUTOR.has(retidoOrdenacao2)
}

export function retidoExigePesquisa1Conexo(retidoOrdenacao1: string | undefined): boolean {
  if (!retidoOrdenacao1) return true
  return !ORDENACAO_SEM_PESQUISA_CONEXO.has(retidoOrdenacao1)
}

export function retidoExigePesquisa2Conexo(retidoOrdenacao2: string | undefined): boolean {
  if (!retidoOrdenacao2) return false
  return !ORDENACAO_SEM_PESQUISA_CONEXO.has(retidoOrdenacao2)
}

export function retidoExigePesquisa1Titular(retidoOrdenacao1: string | undefined): boolean {
  if (!retidoOrdenacao1) return true
  return !ORDENACAO_SEM_PESQUISA_TITULAR.has(retidoOrdenacao1)
}

export function retidoExigePesquisa2Titular(retidoOrdenacao2: string | undefined): boolean {
  if (!retidoOrdenacao2) return false
  return !ORDENACAO_SEM_PESQUISA_TITULAR.has(retidoOrdenacao2)
}

export function buildRetidoPesquisaParams(
  q: RetidoPesquisaQuery,
  tab: RetidoTab,
): Record<string, string | number> {
  const normalized = normalizeRetidoFiltroForApi(
    {
      retidoOrdenacao1: q.retidoOrdenacao1,
      pesquisa1: q.pesquisa1,
      texto1: q.texto1,
      concatenacaoPesquisa: q.concatenacaoPesquisa,
      retidoOrdenacao2: q.retidoOrdenacao2,
      pesquisa2: q.pesquisa2,
      texto2: q.texto2,
      selecaoDigital: q.selecaoDigital,
    },
    tab,
  )

  const out: Record<string, string | number> = {
    page: q.page,
    size: q.size,
  }

  const apiSort = retidoUiSortToApiSort(q.sort ?? null)
  if (apiSort) out.sort = apiSort

  for (const [key, value] of Object.entries(normalized)) {
    if (value === undefined || value === null || value === '') continue
    out[key] = String(value)
  }

  return out
}

export function pkCodigoToString(pk: string | number): string {
  return typeof pk === 'number' ? String(pk) : pk
}

export interface RetidoPesquisaFiltroUrl {
  retidoOrdenacao1?: string
  pesquisa1?: string
  texto1?: string
  concatenacaoPesquisa?: string
  retidoOrdenacao2?: string
  pesquisa2?: string
  texto2?: string
  selecaoDigital?: string
}

function ordenacaoSemPesquisaForTab(tab: RetidoTab): Set<string> {
  if (tab === 'autoral') return ORDENACAO_SEM_PESQUISA_AUTOR
  if (tab === 'titular') return ORDENACAO_SEM_PESQUISA_TITULAR
  return ORDENACAO_SEM_PESQUISA_CONEXO
}

export function normalizeRetidoFiltroForApi(
  f: RetidoPesquisaFiltroUrl,
  tab: RetidoTab,
): RetidoPesquisaFiltroUrl {
  const semPesquisa = ordenacaoSemPesquisaForTab(tab)
  const hasConcat = Boolean(f.concatenacaoPesquisa?.trim())

  const out: RetidoPesquisaFiltroUrl = {
    retidoOrdenacao1: f.retidoOrdenacao1,
    texto1: f.texto1,
    selecaoDigital: f.selecaoDigital ?? 'TODOS',
  }

  if (f.retidoOrdenacao1 && semPesquisa.has(f.retidoOrdenacao1)) {
    out.pesquisa1 = f.pesquisa1?.trim() || 'EXATAMENTE'
  } else if (f.pesquisa1?.trim()) {
    out.pesquisa1 = f.pesquisa1.trim()
  }

  if (hasConcat) {
    out.concatenacaoPesquisa = f.concatenacaoPesquisa!.trim()
    out.retidoOrdenacao2 = f.retidoOrdenacao2
    out.texto2 = f.texto2
    if (f.retidoOrdenacao2 && semPesquisa.has(f.retidoOrdenacao2)) {
      out.pesquisa2 = f.pesquisa2?.trim() || 'EXATAMENTE'
    } else if (f.pesquisa2?.trim()) {
      out.pesquisa2 = f.pesquisa2.trim()
    }
  }

  return out
}

export function buildRetidoExcelTodosFiltroPayload(
  f: RetidoPesquisaFiltroUrl,
  tab: RetidoTab,
): Record<string, string> {
  const normalized = normalizeRetidoFiltroForApi(f, tab)
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(normalized)) {
    if (value === undefined || value === null || value === '') continue
    out[key] = String(value)
  }
  return out
}

export function canRunRetidoPesquisa(tab: RetidoTab, f: RetidoPesquisaFiltroUrl): boolean {
  if (!f.retidoOrdenacao1?.trim() || !f.texto1?.trim()) return false

  if (tab === 'autoral') {
    if (retidoExigePesquisa1Autoral(f.retidoOrdenacao1) && !f.pesquisa1?.trim()) return false
    if (f.concatenacaoPesquisa?.trim()) {
      if (!f.retidoOrdenacao2?.trim() || !f.texto2?.trim()) return false
      if (retidoExigePesquisa2Autoral(f.retidoOrdenacao2) && !f.pesquisa2?.trim()) return false
    }
    return true
  }

  if (tab === 'titular') {
    if (retidoExigePesquisa1Titular(f.retidoOrdenacao1) && !f.pesquisa1?.trim()) return false
    if (f.concatenacaoPesquisa?.trim()) {
      if (!f.retidoOrdenacao2?.trim() || !f.texto2?.trim()) return false
      if (retidoExigePesquisa2Titular(f.retidoOrdenacao2) && !f.pesquisa2?.trim()) return false
    }
    return true
  }

  if (retidoExigePesquisa1Conexo(f.retidoOrdenacao1) && !f.pesquisa1?.trim()) return false
  if (f.concatenacaoPesquisa?.trim()) {
    if (!f.retidoOrdenacao2?.trim() || !f.texto2?.trim()) return false
    if (retidoExigePesquisa2Conexo(f.retidoOrdenacao2) && !f.pesquisa2?.trim()) return false
  }
  return true
}

export function retidoTableSortColumn(
  columnId: string,
  currentSort: SortParam | null,
): SortParam | undefined {
  if (!isRetidoColumnSortable(columnId)) return undefined

  const current = currentSort ?? undefined
  if (!current) return `${columnId},asc`
  if (current.startsWith(columnId + ',') && current.endsWith(',asc')) return `${columnId},desc`
  if (current.startsWith(columnId + ',') && current.endsWith(',desc')) return undefined
  return `${columnId},asc`
}

export function isRetidoOrdenacaoAutor(
  v: string | undefined,
): v is (typeof RETIDO_ORDENACAO_AUTOR_VALUES)[number] {
  return v !== undefined && (RETIDO_ORDENACAO_AUTOR_VALUES as readonly string[]).includes(v)
}

export function isRetidoOrdenacaoConexo(
  v: string | undefined,
): v is (typeof RETIDO_ORDENACAO_CONEXO_VALUES)[number] {
  return v !== undefined && (RETIDO_ORDENACAO_CONEXO_VALUES as readonly string[]).includes(v)
}

export function isRetidoOrdenacaoTitular(
  v: string | undefined,
): v is (typeof RETIDO_ORDENACAO_TITULAR_VALUES)[number] {
  return v !== undefined && (RETIDO_ORDENACAO_TITULAR_VALUES as readonly string[]).includes(v)
}
