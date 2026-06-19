import { handleMutationError } from '@/lib/api/api-error-handler'
import { useApiMutation } from '@/lib/api/use-api-mutation'
import { normalizeDuration } from '@/lib/masks'
import type { CreateObraMusicalFormData } from '@/schemas/create-obra-musical-schema'
import type { ObraMusicalApi, ObraMusicalCreateInput, SimNaoApi } from '@/types/api/documentacao'

function toSimNao(value: boolean): SimNaoApi {
  return value ? 'S' : 'N'
}

export function buildObraMusicalCreatePayload(
  data: CreateObraMusicalFormData,
): ObraMusicalCreateInput {
  const payload: ObraMusicalCreateInput = {
    titulo: data.titulo.trim(),
    nacional: toSimNao(data.nacional),
    instrumental: toSimNao(data.instrumental),
    derivada: data.derivada,
    composta: toSimNao(data.composta),
    usoIA: toSimNao(data.usoIA),
  }

  const duracao = normalizeDuration(data.duracao ?? '')
  if (duracao) payload.duracao = duracao
  if (data.dtCriacao?.trim()) payload.dtCriacao = data.dtCriacao.trim()
  if (data.generoMusicalCodigo?.trim()) {
    payload.generoMusical = { codigo: data.generoMusicalCodigo }
  }
  if (data.idiomaSigla?.trim()) payload.idioma = { sigla: data.idiomaSigla }
  if (data.composta && data.tipoObraComposta?.trim()) {
    payload.tipoObraComposta = { tipo: data.tipoObraComposta }
  }
  if (data.derivada === 'S' && data.obraOriginalId) {
    payload.obraMusicalOriginal = { id: data.obraOriginalId }
  }
  if (data.usoIA && data.tpUsoIA) payload.tpUsoIA = data.tpUsoIA
  if (data.linkAudio?.trim()) payload.linkAudio = data.linkAudio.trim()

  if (data.titulares.length > 0) {
    payload.obraMusicalTitular = data.titulares.map((titular, index) => ({
      titular: { id: titular.titularId! },
      subcategoria: { codSubCategoria: titular.subcategoriaCodigo },
      percentual: titular.percentual,
      linkSoc: index + 1,
      ...(titular.dtInicio?.trim() ? { dtInicio: titular.dtInicio } : {}),
    }))
  }

  if (data.subtitulos.length > 0) {
    payload.obraMusicalSubtitulo = data.subtitulos.map((item) => ({
      subtitulo: item.subtitulo.trim(),
      tipoTitulo: { codigo: item.tipoTitulo },
    }))
  }

  if (data.referencias.length > 0) {
    payload.obraMusicalReferencia = data.referencias.map((item) => ({
      referencia: item.referencia.trim(),
      categoria: { codigo: item.categoriaCodigo },
    }))
  }

  if (data.usoIA && data.elementosIa.length > 0) {
    payload.obraMusicalElementoIAG = data.elementosIa.map((item) => ({
      elemento: { codigo: Number(item.elementoCodigo) },
      ferramentas: item.ferramentas?.trim() || undefined,
      observacao: item.observacao?.trim() || undefined,
    }))
  }

  return payload
}

export function useCreateObraMusical() {
  return useApiMutation<ObraMusicalApi, ObraMusicalCreateInput>({
    method: 'POST',
    url: '/sipa-documentacao/v1/obras-musicais',
    data: (v: ObraMusicalCreateInput) => v,
  })
}

export function useUpdateObraMusical() {
  return useApiMutation<ObraMusicalApi, { id: number; payload: ObraMusicalCreateInput }>(
    {
      method: 'PUT',
      url: ({ id }) => `/sipa-documentacao/v1/obras-musicais/${id}`,
      data: ({ payload }: { id: number; payload: ObraMusicalCreateInput }) => payload,
    },
    { onError: handleMutationError },
  )
}

export function useDeleteObraMusical() {
  return useApiMutation<void, number>(
    {
      method: 'DELETE',
      url: (id) => `/sipa-documentacao/v1/obras-musicais/${id}`,
      sendBody: false,
    },
    { onError: handleMutationError },
  )
}
