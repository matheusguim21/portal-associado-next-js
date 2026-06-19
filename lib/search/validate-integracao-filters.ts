import type { SearchObraMusicalFormData } from '@/schemas/search-obra-musical-schema'
import type { SearchFonogramaFormData } from '@/schemas/search-fonograma-schema'
import type { SearchTitularFormData } from '@/schemas/search-titular-schema'
import { normalizeCpfCnpj, normalizeIsrc } from '@/lib/masks'

function emptyToUndefined(value?: string) {
  if (!value || value.trim() === '') return undefined
  return value.trim()
}

export function validateConsultaObraFilters(data: SearchObraMusicalFormData): string | null {
  const titulo = emptyToUndefined(data.titulo)
  const hasFilter =
    data.titularId != null ||
    data.codigoEcad != null ||
    titulo != null ||
    data.id != null

  if (!hasFilter) {
    return 'Selecione pelo menos um filtro para pesquisar (Código SOC, Código ECAD, Título ou Titular).'
  }
  return null
}

export function validateIntegracaoObraFilters(data: SearchObraMusicalFormData): string | null {
  const titulo = emptyToUndefined(data.titulo)
  const titularNome = emptyToUndefined(data.titularNome)
  const titularPseudonimo = emptyToUndefined(data.titularPseudonimo)

  const hasFilter =
    data.id != null ||
    data.codigoEcad != null ||
    titulo != null ||
    titularNome != null ||
    titularPseudonimo != null

  if (!hasFilter) {
    return 'É necessário informar ao menos um dos campos: Código SOC, Código ECAD, Título, Titular ou Pseudônimo.'
  }
  if (titulo != null && titulo.length < 3) {
    return 'Para pesquisar pelo Título, preencha com pelo menos 3 caracteres.'
  }
  if (titularNome != null && titularNome.length < 4) {
    return 'Para pesquisar pelo Titular, preencha com pelo menos 4 caracteres.'
  }
  if (titularPseudonimo != null && titularPseudonimo.length < 4) {
    return 'Para pesquisar pelo Pseudônimo, preencha com pelo menos 4 caracteres.'
  }
  return null
}

export function validateIntegracaoFonogramaFilters(data: SearchFonogramaFormData): string | null {
  if (!data.tipoObmPop) {
    return 'Para pesquisar fonogramas, informe o tipo: Obra Musical ou Pout Pourrit.'
  }

  const titulo = emptyToUndefined(data.titulo)
  const titularNome = emptyToUndefined(data.titularNome)
  const titularPseudonimo = emptyToUndefined(data.titularPseudonimo)
  const isrc = data.isrc ? normalizeIsrc(data.isrc) : undefined

  const hasFilter =
    data.id != null ||
    data.codigoEcad != null ||
    titulo != null ||
    isrc != null ||
    titularNome != null ||
    titularPseudonimo != null

  if (!hasFilter) {
    return 'É necessário informar ao menos um dos campos: Código SOC, Código ECAD, Título, ISRC, Titular ou Pseudônimo.'
  }
  if (titulo != null && titulo.length < 3) {
    return 'Para pesquisar pelo Título da Obra, preencha com pelo menos 3 caracteres.'
  }
  if (titularNome != null && titularNome.length < 4) {
    return 'Para pesquisar pelo Titular, preencha com pelo menos 4 caracteres.'
  }
  if (titularPseudonimo != null && titularPseudonimo.length < 4) {
    return 'Para pesquisar pelo Pseudônimo, preencha com pelo menos 4 caracteres.'
  }
  if (isrc != null && isrc.length !== 12) {
    return 'Para pesquisar pelo ISRC, preencha com 12 caracteres.'
  }
  return null
}

/** Cadastro: lista apenas obras do titular logado — filtros de titular são opcionais. */
export function validateMeusObraFilters(data: SearchObraMusicalFormData): string | null {
  const titulo = emptyToUndefined(data.titulo)

  if (titulo != null && titulo.length < 3) {
    return 'Para pesquisar pelo Título, preencha com pelo menos 3 caracteres.'
  }
  return null
}

/** Cadastro: lista apenas fonogramas do usuário logado — filtros de titular são opcionais. */
export function validateMeusFonogramaFilters(data: SearchFonogramaFormData): string | null {
  const titulo = emptyToUndefined(data.titulo)
  const isrc = data.isrc ? normalizeIsrc(data.isrc) : undefined

  if (titulo != null && titulo.length < 3) {
    return 'Para pesquisar pelo Título da Obra, preencha com pelo menos 3 caracteres.'
  }
  if (isrc != null && isrc.length !== 12) {
    return 'Para pesquisar pelo ISRC, preencha com 12 caracteres.'
  }
  return null
}

export function validateTitularFilters(data: SearchTitularFormData): string | null {
  const nome = emptyToUndefined(data.nome)
  const pseudonimo = emptyToUndefined(data.pseudonimo)
  const cpfCnpj = data.cpfCnpj ? normalizeCpfCnpj(data.cpfCnpj) : undefined
  const id = emptyToUndefined(data.id)
  const codigoEcad = emptyToUndefined(data.codigoEcad)

  const hasFilter =
    id != null ||
    codigoEcad != null ||
    nome != null ||
    pseudonimo != null ||
    (cpfCnpj != null && cpfCnpj.length > 0)

  if (!hasFilter) {
    return 'É necessário informar ao menos um dos campos: Código SOC, Código ECAD, Nome, Pseudônimo ou CPF/CNPJ do Titular.'
  }
  if (nome != null && nome.length < 3) {
    return 'Para pesquisar pelo Nome do Titular, preencha com pelo menos 3 caracteres.'
  }
  if (pseudonimo != null && pseudonimo.length < 3) {
    return 'Para pesquisar pelo Pseudônimo do Titular, preencha com pelo menos 3 caracteres.'
  }
  return null
}
