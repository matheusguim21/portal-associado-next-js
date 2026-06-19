import type { SearchKind } from '@/types/api/search'
import { SEARCH_KIND_LABELS, SEARCH_KINDS } from '@/types/api/search'

export type SelectOption = { value: string; label: string }

export const searchKindOptions: SelectOption[] = SEARCH_KINDS.map((kind) => ({
  value: kind,
  label: SEARCH_KIND_LABELS[kind as SearchKind],
}))

export const nacionalOptions: SelectOption[] = [
  { value: 'S', label: 'Sim' },
  { value: 'N', label: 'Não' },
]

export const holderStatusOptions: SelectOption[] = [
  { value: 'A', label: 'Ativo' },
  { value: 'I', label: 'Inativo' },
]

export const derivadaOptions: SelectOption[] = [
  { value: 'N', label: 'Original' },
  { value: 'S', label: 'Derivada' },
]

export const arquivoRepertorioStatusOptions: SelectOption[] = [
  { value: 'SALVO', label: 'Salvo' },
  { value: 'GRAVADO', label: 'Gravado' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'PROCESSADO', label: 'Processado' },
  { value: 'ERRO', label: 'Erro' },
  { value: 'CAD_TITULAR', label: 'Cadastro Titular' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'LEITURA', label: 'Leitura' },
]

export const situacaoCadastralFonogramaOptions: SelectOption[] = [
  { value: 'D', label: 'Duplicidade' },
  { value: 'I', label: 'Fonograma Não Signatário da Convenção de Roma' },
  { value: 'L', label: 'Liberado' },
  { value: 'P', label: 'Pendente de Identificação' },
  { value: 'R', label: 'Pendente de Documentação' },
  { value: 'V', label: 'Pendente de Validação' },
]

export const tipoObmPopOptions: SelectOption[] = [
  { value: 'OBRA_MUSICAL', label: 'Obra Musical' },
  { value: 'POUT_POURRIT', label: 'Pout Pourrit' },
]

export const arquivoRepertorioTipoOptions: SelectOption[] = [
  { value: 'OBRA_MUSICAL', label: 'Obra Musical' },
  { value: 'POUT_POURRIT', label: 'Pout Pourrit' },
  { value: 'COLETIVO', label: 'Coletivo' },
  { value: 'FONOGRAMA', label: 'Fonograma' },
  { value: 'AUDIOVISUAL', label: 'Audiovisual' },
  { value: 'ECAD_RETORNO', label: 'Retorno Ecad' },
  { value: 'TITULAR', label: 'Titular' },
]
