import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation } from '@/lib/api/use-api-mutation'
import { normalizeDuration, normalizeIsrc } from '@/lib/masks'
import type { CreateFonogramaFormData } from '@/schemas/create-fonograma-schema'
import type {
  FonogramaApi,
  FonogramaCreateInput,
  FonogramaTitularInput,
  IsrcOnlineCodigoApi,
} from '@/types/api/documentacao'

const PERCENTUAIS_PADRAO_CADASTRO = [
  { subcategoria: 'PF', percentual: 41.7, interpretePrincipal: 'N' as const },
  { subcategoria: 'I', percentual: 41.7, interpretePrincipal: 'S' as const },
  { subcategoria: 'MA', percentual: 16.6, interpretePrincipal: 'N' as const },
]

export function buildTitularesComPercentualAutomatico(titularId: number): FonogramaTitularInput[] {
  return PERCENTUAIS_PADRAO_CADASTRO.map((item) => ({
    titular: { id: titularId },
    subcategoria: { codSubCategoria: item.subcategoria },
    percentual: item.percentual,
    percentualAutomatico: 'S',
    interpretePrincipal: item.interpretePrincipal,
  }))
}

export function buildFonogramaCreatePayload(
  data: CreateFonogramaFormData,
  titulares: FonogramaTitularInput[],
): FonogramaCreateInput {
  const isrc = data.isrc ? normalizeIsrc(data.isrc) : undefined
  const gra = data.gra ? Number.parseInt(data.gra, 10) : undefined
  const link =
    data.tipoObmPop === 'POUT_POURRIT'
      ? { poutPourrit: { id: data.codigoSocObraPoutPourrit! } }
      : { obraMusical: { id: data.codigoSocObraPoutPourrit! } }

  return {
    ...(isrc ? { isrc } : {}),
    instrumental: data.instrumental ? 'S' : 'N',
    nacional: data.nacional ? 'S' : 'N',
    duracao: data.duracao ? normalizeDuration(data.duracao) || undefined : undefined,
    ...(gra != null && !Number.isNaN(gra) ? { gra } : {}),
    rotulo: 'N',
    bloqueado: 'N',
    publicacaoSimultanea: 'N',
    dominioPublico: 'N',
    rotMusicoAcompanhante: 'N',
    fonogramaPendenteFicha: 'N',
    status: 'CAD_TITULAR',
    temAgregadora: 'N',
    usoIA: 'N',
    fonogramaTitular: titulares,
    ...link,
  }
}

export function useCreateFonograma() {
  return useApiMutation<FonogramaApi, FonogramaCreateInput>(
    {
      method: 'POST',
      url: '/sipa-documentacao/v1/fonogramas',
      data: (v) => v,
    },
    { onError: handleMutationError },
  )
}

export function useGerarIsrc() {
  return useApiMutation<IsrcOnlineCodigoApi, number>(
    {
      method: 'GET',
      url: (titularId) => `/sipa-documentacao/v1/isrc-on-line/${titularId}`,
      sendBody: false,
    },
    { onError: handleMutationError },
  )
}
