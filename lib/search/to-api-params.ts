import { normalizeCpfCnpj, normalizeIsrc, normalizePhone } from '@/lib/masks'
import type { ObraMusicalFiltro, FonogramaFiltro, TitularFiltro } from '@/types/api/documentacao'
import type { SearchObraMusicalFormData } from '@/schemas/search-obra-musical-schema'
import type { SearchFonogramaFormData } from '@/schemas/search-fonograma-schema'
import type { SearchTitularFormData } from '@/schemas/search-titular-schema'

function omitEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>
}

export function obraFormToApiParams(
  data: SearchObraMusicalFormData,
  pagination: { page: number; size: number; sort?: string },
): ObraMusicalFiltro {
  const titulo = emptyToUndefined(data.titulo)
  const titularNome = emptyToUndefined(data.titularNome)
  const titularPseudonimo = emptyToUndefined(data.titularPseudonimo)

  return omitEmpty({
    pesquisa: data.pesquisa,
    id: data.id,
    titulo,
    codigoEcad: data.codigoEcad,
    nacional: data.nacional,
    derivada: data.derivada,
    titularId: data.titularId,
    titularNome,
    titularPseudonimo,
    status: data.status,
    page: pagination.page,
    size: pagination.size,
    sort: pagination.sort,
  }) as ObraMusicalFiltro
}

export function fonogramaFormToApiParams(
  data: SearchFonogramaFormData,
  pagination: { page: number; size: number; sort?: string },
): FonogramaFiltro {
  const dtEmissao = data.dtEmissao
    ? data.dtEmissao.toISOString().split('T')[0]
    : undefined

  const titulo = emptyToUndefined(data.titulo)
  const titularNome = emptyToUndefined(data.titularNome)
  const titularPseudonimo = emptyToUndefined(data.titularPseudonimo)
  const isrc = data.isrc ? normalizeIsrc(data.isrc) : undefined
  const gra = emptyToUndefined(data.gra)

  return omitEmpty({
    tipoObmPop: data.tipoObmPop,
    pesquisa: data.pesquisa,
    id: data.id,
    codigoEcad: data.codigoEcad,
    isrc: isrc || undefined,
    gra,
    titulo,
    situacaoCadastral: data.situacaoCadastral,
    dtEmissao,
    status: data.status,
    nacional: data.nacional,
    titularId: data.titularId,
    titularNome,
    titularPseudonimo,
    page: pagination.page,
    size: pagination.size,
    sort: pagination.sort,
  }) as FonogramaFiltro
}

function parseOptionalNumber(value?: string) {
  const trimmed = emptyToUndefined(value)
  if (trimmed == null) return undefined
  const num = Number(trimmed)
  return Number.isNaN(num) ? undefined : num
}

export function titularFormToApiParams(
  data: SearchTitularFormData,
  pagination: { page: number; size: number; sort?: string },
): TitularFiltro {
  const nome = emptyToUndefined(data.nome)
  const email = emptyToUndefined(data.email)
  const pseudonimo = emptyToUndefined(data.pseudonimo)
  const cpfCnpj = data.cpfCnpj ? normalizeCpfCnpj(data.cpfCnpj) : undefined
  const celular = data.celular ? normalizePhone(data.celular) : undefined
  const codigoIpi = emptyToUndefined(data.codigoIpi)

  return omitEmpty({
    pesquisa: data.pesquisa,
    id: parseOptionalNumber(data.id),
    nome,
    email,
    pseudonimo,
    cpfCnpj: cpfCnpj || undefined,
    celular: celular || undefined,
    codigoEcad: parseOptionalNumber(data.codigoEcad),
    codigoCae: parseOptionalNumber(data.codigoCae),
    codigoIpi,
    codigoIpn: parseOptionalNumber(data.codigoIpn),
    situacaoCadastro: data.situacaoCadastro,
    nacional: data.nacional as 'S' | 'N' | undefined,
    page: pagination.page,
    size: pagination.size,
    sort: pagination.sort,
  }) as TitularFiltro
}

function emptyToUndefined(value?: string) {
  if (!value || value.trim() === '') return undefined
  return value.trim()
}
