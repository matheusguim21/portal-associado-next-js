import type { ObraMusicalFiltro, FonogramaFiltro } from '@/types/api/documentacao'

export function obraFiltroToParams(v: ObraMusicalFiltro) {
  return {
    pesquisa: v.pesquisa,
    titulo: v.titulo,
    id: v.id,
    codigoEcad: v.codigoEcad,
    nacional: v.nacional,
    derivada: v.derivada,
    titularId: v.titularId,
    titularNome: v.titularNome,
    titularPseudonimo: v.titularPseudonimo,
    status: v.status,
    page: v.page ?? 0,
    size: v.size ?? 10,
    sort: v.sort,
  }
}

export function fonogramaFiltroToParams(v: FonogramaFiltro) {
  return {
    tipoObmPop: v.tipoObmPop,
    pesquisa: v.pesquisa,
    titulo: v.titulo,
    isrc: v.isrc,
    id: v.id,
    codigoEcad: v.codigoEcad,
    gra: v.gra,
    situacaoCadastral: v.situacaoCadastral,
    dtEmissao: v.dtEmissao,
    status: v.status,
    nacional: v.nacional,
    titularId: v.titularId,
    titularNome: v.titularNome,
    titularPseudonimo: v.titularPseudonimo,
    page: v.page ?? 0,
    size: v.size ?? 10,
    sort: v.sort,
  }
}
