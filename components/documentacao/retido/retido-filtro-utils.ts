import type { MutableRefObject } from 'react'
import type { RetidoSearchFormValues } from '@/schemas/search-retido-schema'
import type { RetidoPesquisaFiltroUrl } from '@/lib/retido-pesquisa'
import type { RetidoTab } from '@/types/api/documentacao/retido'

export function retidoSearchFormDefaults(
  iv?: Partial<RetidoSearchFormValues>,
): RetidoSearchFormValues {
  return {
    retidoOrdenacao1: iv?.retidoOrdenacao1 ?? '',
    pesquisa1: iv?.pesquisa1 ?? '',
    texto1: iv?.texto1 ?? '',
    concatenacaoPesquisa: iv?.concatenacaoPesquisa ?? '',
    retidoOrdenacao2: iv?.retidoOrdenacao2 ?? '',
    pesquisa2: iv?.pesquisa2 ?? '',
    texto2: iv?.texto2 ?? '',
    selecaoDigital: iv?.selecaoDigital ?? 'TODOS',
  }
}

export type RetidoSearchFormGetValuesRef = MutableRefObject<
  (() => RetidoSearchFormValues) | null
>

export function tabFromParams(raw: string | null): RetidoTab {
  if (raw === 'conexo') return 'conexo'
  if (raw === 'titular') return 'titular'
  return 'autoral'
}

function trimToUndef(v: string | undefined): string | undefined {
  const t = v?.trim()
  return t === undefined || t === '' ? undefined : t
}

export function filtroFromForm(form: RetidoSearchFormValues): RetidoPesquisaFiltroUrl {
  const hasSegundoBloco = Boolean(form.concatenacaoPesquisa?.trim())
  const base: RetidoPesquisaFiltroUrl = {
    retidoOrdenacao1: trimToUndef(form.retidoOrdenacao1),
    pesquisa1: trimToUndef(form.pesquisa1),
    texto1: trimToUndef(form.texto1),
    selecaoDigital: trimToUndef(form.selecaoDigital),
  }
  if (!hasSegundoBloco) return base
  return {
    ...base,
    concatenacaoPesquisa: trimToUndef(form.concatenacaoPesquisa),
    retidoOrdenacao2: trimToUndef(form.retidoOrdenacao2),
    pesquisa2: trimToUndef(form.pesquisa2),
    texto2: trimToUndef(form.texto2),
  }
}

export function emptyFiltrosPorAba(): Record<RetidoTab, RetidoPesquisaFiltroUrl> {
  return { autoral: {}, conexo: {}, titular: {} }
}

export function formFiltroToInitialValues(
  f: RetidoPesquisaFiltroUrl,
): Partial<RetidoSearchFormValues> {
  return {
    retidoOrdenacao1: f.retidoOrdenacao1 ?? '',
    pesquisa1: f.pesquisa1 ?? 'CONTENDO',
    texto1: f.texto1 ?? '',
    concatenacaoPesquisa: (f.concatenacaoPesquisa ??
      '') as RetidoSearchFormValues['concatenacaoPesquisa'],
    retidoOrdenacao2: f.retidoOrdenacao2 ?? '',
    pesquisa2: f.pesquisa2 ?? 'CONTENDO',
    texto2: f.texto2 ?? '',
    selecaoDigital: (f.selecaoDigital ?? 'TODOS') as RetidoSearchFormValues['selecaoDigital'],
  }
}
