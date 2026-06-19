import 'server-only'

import { mapObraMusicalApiToFormData } from '@/lib/documentacao/map-obra-musical-form'
import { serverFetchJson } from '@/lib/api/server-data'
import type { CreateObraMusicalFormData } from '@/schemas/create-obra-musical-schema'
import type {
  ObraMusicalApi,
  ObraMusicalElementoIAGApi,
  ObraMusicalReferenciaApi,
  ObraMusicalSubtituloApi,
} from '@/types/api/documentacao'

export async function loadObraMusicalFormDataServer(
  obraId: number,
): Promise<CreateObraMusicalFormData> {
  const [obra, subtitulos, referencias, elementos] = await Promise.all([
    serverFetchJson<ObraMusicalApi>(`/sipa-documentacao/v1/obras-musicais/${obraId}`),
    serverFetchJson<ObraMusicalSubtituloApi[]>(
      `/sipa-documentacao/v1/obras-musicais/${obraId}/subtitulos-da-obra`,
    ),
    serverFetchJson<ObraMusicalReferenciaApi[]>(
      `/sipa-documentacao/v1/obras-musicais/${obraId}/referencias-da-obra`,
    ),
    serverFetchJson<ObraMusicalElementoIAGApi[]>(
      `/sipa-documentacao/v1/obras-musicais/${obraId}/arquivos/elementos-ia`,
    ),
  ])

  return mapObraMusicalApiToFormData(obra, subtitulos ?? [], referencias ?? [], elementos ?? [])
}
