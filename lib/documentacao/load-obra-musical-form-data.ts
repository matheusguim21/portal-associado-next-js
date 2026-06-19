import { apiClient } from '@/lib/api/api-fetch'
import { mapObraMusicalApiToFormData } from '@/lib/documentacao/map-obra-musical-form'
import type { CreateObraMusicalFormData } from '@/schemas/create-obra-musical-schema'
import type {
  ObraMusicalApi,
  ObraMusicalElementoIAGApi,
  ObraMusicalReferenciaApi,
  ObraMusicalSubtituloApi,
} from '@/types/api/documentacao'

export async function loadObraMusicalFormData(obraId: number): Promise<CreateObraMusicalFormData> {
  const [obraRes, subtitulosRes, referenciasRes, elementosRes] = await Promise.all([
    apiClient.get<ObraMusicalApi>(`/sipa-documentacao/v1/obras-musicais/${obraId}`),
    apiClient.get<ObraMusicalSubtituloApi[]>(
      `/sipa-documentacao/v1/obras-musicais/${obraId}/subtitulos-da-obra`,
    ),
    apiClient.get<ObraMusicalReferenciaApi[]>(
      `/sipa-documentacao/v1/obras-musicais/${obraId}/referencias-da-obra`,
    ),
    apiClient.get<ObraMusicalElementoIAGApi[]>(
      `/sipa-documentacao/v1/obras-musicais/${obraId}/arquivos/elementos-ia`,
    ),
  ])

  return mapObraMusicalApiToFormData(
    obraRes.data,
    subtitulosRes.data ?? [],
    referenciasRes.data ?? [],
    elementosRes.data ?? [],
  )
}
