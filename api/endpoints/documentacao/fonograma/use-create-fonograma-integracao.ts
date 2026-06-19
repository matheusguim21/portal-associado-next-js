import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation } from '@/lib/api/use-api-mutation'
import { normalizeDuration, normalizeIsrc } from '@/lib/masks'
import type { CreateFonogramaFormData } from '@/schemas/create-fonograma-schema'
import type { FonogramaApi } from '@/types/api/documentacao'

type SimNao = 'S' | 'N'

export type FonogramaIntegracaoPayload = {
  fonograma: {
    isrc?: string
    instrumental: SimNao
    nacional: SimNao
    duracao?: string
    gra?: string
    rotulo: SimNao
    bloqueado: SimNao
    publicacaoSimultanea: SimNao
    dominioPublico: SimNao
    rotMusicoAcompanhante: SimNao
    fonogramaPendenteFicha: SimNao
    status: 'CAD_TITULAR'
    temAgregadora: SimNao
    obraMusical?: { id: number }
    poutPourrit?: { id: number }
  }
  titularAdministrado: { id: number }
}

export function buildFonogramaIntegracaoPayload(
  data: CreateFonogramaFormData,
  titularId: number,
): FonogramaIntegracaoPayload {
  const isrc = data.isrc ? normalizeIsrc(data.isrc) : undefined
  const link =
    data.tipoObmPop === 'POUT_POURRIT'
      ? { poutPourrit: { id: data.codigoSocObraPoutPourrit } }
      : { obraMusical: { id: data.codigoSocObraPoutPourrit } }

  return {
    fonograma: {
      ...(isrc ? { isrc } : {}),
      instrumental: data.instrumental ? 'S' : 'N',
      nacional: data.nacional ? 'S' : 'N',
      duracao: data.duracao ? normalizeDuration(data.duracao) || undefined : undefined,
      gra: data.gra || undefined,
      rotulo: 'N',
      bloqueado: 'N',
      publicacaoSimultanea: 'N',
      dominioPublico: 'N',
      rotMusicoAcompanhante: 'N',
      fonogramaPendenteFicha: 'N',
      status: 'CAD_TITULAR',
      temAgregadora: 'N',
      ...link,
    },
    titularAdministrado: { id: titularId },
  }
}

export function useCreateFonogramaIntegracao() {
  return useApiMutation<FonogramaApi, FonogramaIntegracaoPayload>(
    {
      method: 'POST',
      url: '/sipa-documentacao/v1/integracao/fonogramas',
      data: (v) => v,
    },
    { onError: handleMutationError },
  )
}
