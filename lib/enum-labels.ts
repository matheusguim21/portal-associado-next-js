import {
  arquivoRepertorioStatusOptions,
  arquivoRepertorioTipoOptions,
  derivadaOptions,
  holderStatusOptions,
  nacionalOptions,
  situacaoCadastralFonogramaOptions,
  tipoObmPopOptions,
  type SelectOption,
} from '@/lib/search/filter-options'

export function getOptionLabel(
  options: SelectOption[],
  value?: string | null,
  fallback = '—',
): string {
  if (!value) return fallback
  return options.find((opt) => opt.value === value)?.label ?? value
}

export const getNacionalLabel = (value?: string | null) =>
  getOptionLabel(nacionalOptions, value)

export const getDerivadaLabel = (value?: string | null) =>
  getOptionLabel(derivadaOptions, value)

export const getArquivoRepertorioStatusLabel = (value?: string | null) =>
  getOptionLabel(arquivoRepertorioStatusOptions, value)

export const getArquivoRepertorioTipoLabel = (value?: string | null) =>
  getOptionLabel(arquivoRepertorioTipoOptions, value)

export const getTipoObmPopLabel = (value?: string | null) =>
  getOptionLabel(tipoObmPopOptions, value)

export const getHolderStatusLabel = (value?: string | null) =>
  getOptionLabel(holderStatusOptions, value)

const situacaoCadastralObraLabels: Record<string, string> = {
  DU: 'Duplicidade',
  EC: 'Em conflito',
  ID: 'Identificada',
  PI: 'Pendente de identificação',
  PV: 'Pendente de validação',
  LI: 'Liberada',
}

const situacaoCadastralFonogramaLabels: Record<string, string> = Object.fromEntries(
  situacaoCadastralFonogramaOptions.map((opt) => [opt.value, opt.label]),
)

type SituacaoCadastral = {
  sigla?: string | null
  descricao?: string | null
  codigo?: string | null
}

export function getSituacaoCadastralKey(
  situacao?: SituacaoCadastral | null,
): string | undefined {
  return situacao?.sigla ?? situacao?.codigo ?? undefined
}

export function getSituacaoCadastralLabel(
  situacao?: SituacaoCadastral | null,
  fallback = '—',
): string {
  if (situacao?.descricao) return situacao.descricao
  const key = getSituacaoCadastralKey(situacao)
  if (key) {
    return (
      situacaoCadastralObraLabels[key] ??
      situacaoCadastralFonogramaLabels[key] ??
      key
    )
  }
  return fallback
}
