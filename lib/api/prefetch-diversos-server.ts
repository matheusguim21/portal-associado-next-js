import 'server-only'

import type { QueryClient } from '@tanstack/react-query'
import {
  diversosKeys,
  ELEMENTOS_STALE_TIME,
  isrcHabilitadoKey,
  DIVERSOS_PATHS,
} from '@/lib/api/diversos-query-keys'
import { fetchIsrcHabilitadoServer, serverFetchJson } from '@/lib/api/server-data'
import type {
  CategoriaReferenciaApi,
  ElementoApi,
  GeneroMusicalApi,
  IdiomaApi,
  SubcategoriaBasicoApi,
  TipoObraCompostaApi,
  TipoTituloApi,
} from '@/types/api/documentacao'

const obraCadastroDiversosQueries = [
  {
    queryKey: diversosKeys.generos,
    queryFn: () => serverFetchJson<GeneroMusicalApi[]>(DIVERSOS_PATHS.generos),
  },
  {
    queryKey: diversosKeys.idiomas,
    queryFn: () => serverFetchJson<IdiomaApi[]>(DIVERSOS_PATHS.idiomas),
  },
  {
    queryKey: diversosKeys.tiposObraComposta,
    queryFn: () => serverFetchJson<TipoObraCompostaApi[]>(DIVERSOS_PATHS.tiposObraComposta),
  },
  {
    queryKey: diversosKeys.tiposTitulo,
    queryFn: () => serverFetchJson<TipoTituloApi[]>(DIVERSOS_PATHS.tiposTitulo),
  },
  {
    queryKey: diversosKeys.categoriasReferencia,
    queryFn: () => serverFetchJson<CategoriaReferenciaApi[]>(DIVERSOS_PATHS.categoriasReferencia),
  },
  {
    queryKey: diversosKeys.elementosObra,
    queryFn: () => serverFetchJson<ElementoApi[]>(DIVERSOS_PATHS.elementosObra),
    staleTime: ELEMENTOS_STALE_TIME,
  },
  {
    queryKey: diversosKeys.subcategoriasAutoral,
    queryFn: () => serverFetchJson<SubcategoriaBasicoApi[]>(DIVERSOS_PATHS.subcategoriasAutoral),
  },
] as const

export async function prefetchObraCadastroDiversos(queryClient: QueryClient) {
  await Promise.all(obraCadastroDiversosQueries.map((query) => queryClient.prefetchQuery(query)))
}

export async function prefetchIsrcHabilitado(queryClient: QueryClient, titularId?: number) {
  if (!titularId) return

  await queryClient.prefetchQuery({
    queryKey: isrcHabilitadoKey(titularId),
    queryFn: () => fetchIsrcHabilitadoServer(),
  })
}
