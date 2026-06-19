import { useApiQuery } from '@/lib/api/use-api-query'
import type { ObraMusicalApi } from '@/types/api/documentacao'

export function useGetObraMusical(obraId: number | undefined) {
  return useApiQuery<ObraMusicalApi>(
    ['obra-musical', obraId],
    { url: `/sipa-documentacao/v1/obras-musicais/${obraId}` },
    { enabled: obraId != null && !Number.isNaN(obraId) },
  )
}
