import { useApiQuery } from '@/lib/api/use-api-query'
import {
  DIVERSOS_PATHS,
  diversosKeys,
  ELEMENTOS_STALE_TIME,
} from '@/lib/api/diversos-query-keys'
import type {
  CategoriaReferenciaApi,
  ElementoApi,
  GeneroMusicalApi,
  IdiomaApi,
  SubcategoriaBasicoApi,
  TipoObraCompostaApi,
  TipoTituloApi,
} from '@/types/api/documentacao'

export function useGenerosMusicais() {
  return useApiQuery<GeneroMusicalApi[]>(diversosKeys.generos, {
    url: DIVERSOS_PATHS.generos,
  })
}

export function useIdiomas() {
  return useApiQuery<IdiomaApi[]>(diversosKeys.idiomas, {
    url: DIVERSOS_PATHS.idiomas,
  })
}

export function useTiposObraComposta() {
  return useApiQuery<TipoObraCompostaApi[]>(diversosKeys.tiposObraComposta, {
    url: DIVERSOS_PATHS.tiposObraComposta,
  })
}

export function useTiposTitulo() {
  return useApiQuery<TipoTituloApi[]>(diversosKeys.tiposTitulo, {
    url: DIVERSOS_PATHS.tiposTitulo,
  })
}

export function useCategoriasReferencia() {
  return useApiQuery<CategoriaReferenciaApi[]>(diversosKeys.categoriasReferencia, {
    url: DIVERSOS_PATHS.categoriasReferencia,
  })
}

export function useElementosObra() {
  return useApiQuery<ElementoApi[]>(
    diversosKeys.elementosObra,
    { url: DIVERSOS_PATHS.elementosObra },
    { staleTime: ELEMENTOS_STALE_TIME },
  )
}

export function useElementosFonograma() {
  return useApiQuery<ElementoApi[]>(
    diversosKeys.elementosFonograma,
    { url: DIVERSOS_PATHS.elementosFonograma },
    { staleTime: ELEMENTOS_STALE_TIME },
  )
}

export function useSubcategoriasAutoral() {
  return useApiQuery<SubcategoriaBasicoApi[]>(diversosKeys.subcategoriasAutoral, {
    url: DIVERSOS_PATHS.subcategoriasAutoral,
  })
}
