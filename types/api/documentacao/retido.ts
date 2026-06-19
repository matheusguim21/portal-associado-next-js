import type { SortParam } from '@/types/api/search'

export type RetidoTab = 'autoral' | 'conexo' | 'titular'

export interface RetAutModel {
  pkCodigo: string | number
  compet?: string | null
  nroOcor?: string | number | null
  dscPlano?: string | null
  perDe?: string | null
  perAte?: string | null
  rubrica?: string | null
  nmObra?: string | null
  nmAudio?: string | null
  refAutoral?: string | null
  refInterprete?: string | null
  situacao?: string | null
  motivoRetencao?: string | null
}

export interface RetConModel {
  pkCodigo: string | number
  compet?: string | null
  nroOcor?: string | number | null
  dscPlano?: string | null
  perDe?: string | null
  perAte?: string | null
  rubrica?: string | null
  nmObra?: string | null
  nmAudio?: string | null
  refGravadora?: string | null
  refAutoral?: string | null
  refInterprete?: string | null
  situacao?: string | null
  motivoRetencao?: string | null
}

export interface RetTitModel {
  pkCodigo: string | number
  compet?: string | null
  nroOcor?: string | number | null
  dscPlano?: string | null
  perDe?: string | null
  perAte?: string | null
  categoria?: string | null
  cdTitular?: string | null
  nmTitular?: string | null
  rubrica?: string | null
  nmObra?: string | null
  nmAudio?: string | null
  refAutoral?: string | null
  refInterprete?: string | null
  situacao?: string | null
  motivoRetencao?: string | null
}

export interface RetidoPesquisaQuery {
  page: number
  size: number
  sort?: SortParam
  retidoOrdenacao1?: string
  pesquisa1?: string
  texto1?: string
  concatenacaoPesquisa?: string
  retidoOrdenacao2?: string
  pesquisa2?: string
  texto2?: string
  selecaoDigital?: string
}

export const RETIDO_ORDENACAO_AUTOR_VALUES = [
  'CAT_AUDIO_VISUAL',
  'CDCAPEPI',
  'COD_AUDIO_VISUAL',
  'COD_FONOGRAMA',
  'COD_OBRA',
  'COD_POUT_POURRIT',
  'COMPETENCIA',
  'EXECUCAO_SEGUNDOS',
  'IFPI',
  'INTERPRETE',
  'NOME_SHOW',
  'OCORRENCIA',
  'REF_AUTORAL',
  'RUBRICA',
  'SITUACAO',
  'TIT_AUDIO_VISUAL',
  'TIT_AUDIO_VISUAL_LOCAL',
  'TIT_CAPEPI',
  'TIT_CAPEPI_LOCAL',
  'TIT_OBRA',
  'TIT_POUT_POURRIT',
] as const

export const RETIDO_ORDENACAO_CONEXO_VALUES = [
  'CAT_AUDIO_VISUAL',
  'CDCAPEPI',
  'COD_AUDIO_VISUAL',
  'COD_FONOGRAMA',
  'COD_OBRA',
  'COD_POUT_POURRIT',
  'COMPETENCIA',
  'EXECUCAO_SEGUNDOS',
  'GRAVADORA',
  'IFPI',
  'INTERPRETE',
  'OCORRENCIA',
  'REF_AUTORAL',
  'RUBRICA',
  'SITUACAO',
  'TIT_AUDIO_VISUAL',
  'TIT_AUDIO_VISUAL_LOCAL',
  'TIT_CAPEPI',
  'TIT_CAPEPI_LOCAL',
  'TIT_OBRA',
  'TIT_POUT_POURRIT',
] as const

export const RETIDO_ORDENACAO_TITULAR_VALUES = [
  'CAT_AUDIO_VISUAL',
  'CDCAPEPI',
  'CATEGORIA',
  'COD_AUDIO_VISUAL',
  'COD_FONOGRAMA',
  'COD_OBRA',
  'COD_POUT_POURRIT',
  'COD_TITULAR',
  'COMPETENCIA',
  'EXECUCAO_SEGUNDOS',
  'IFPI',
  'NOME_SHOW',
  'NOME_TITULAR',
  'OCORRENCIA',
  'PSEUDO_TITULAR',
  'REF_AUTORAL',
  'REF_INTERPRETE',
  'RUBRICA',
  'SITUACAO',
  'TIT_AUDIO_VISUAL',
  'TIT_AUDIO_VISUAL_LOCAL',
  'TIT_CAPEPI',
  'TIT_CAPEPI_LOCAL',
  'TIT_OBRA',
  'TIT_POUT_POURRIT',
] as const

export const PESQUISA_RETIDO_VALUES = [
  'COMECANDO',
  'CONTENDO',
  'EXATAMENTE',
  'TERMINANDO',
] as const

export const CONCATENACAO_PESQUISA_VALUES = ['OU', 'E'] as const

export const SELECAO_DIGITAL_VALUES = [
  'TODOS',
  'EXCETO_DIGITAL',
  'SOMENTE_DIGITAL',
] as const
