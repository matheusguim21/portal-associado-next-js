import { z } from 'zod'
import { SEARCH_KINDS } from '@/types/api/search'

const statusEnum = z.enum([
  'SALVO',
  'GRAVADO',
  'ENVIADO',
  'PROCESSADO',
  'ERRO',
  'CAD_TITULAR',
  'PENDENTE',
  'LEITURA',
])

export const searchFonogramaSchema = z.object({
  tipoObmPop: z.enum(['OBRA_MUSICAL', 'POUT_POURRIT']).optional(),
  pesquisa: z.enum(SEARCH_KINDS, { message: 'Tipo de pesquisa é obrigatório' }),
  id: z.number().optional(),
  codigoEcad: z.number().optional(),
  isrc: z.string().optional(),
  gra: z.string().optional(),
  titulo: z.string().optional(),
  situacaoCadastral: z.string().optional(),
  dtEmissao: z.date().optional(),
  status: statusEnum.optional(),
  nacional: z.enum(['S', 'N']).optional(),
  titularId: z.number().optional(),
  titularCodigoEcad: z.number().optional(),
  titularNome: z.string().optional(),
  titularPseudonimo: z.string().optional(),
  codigoEcadObraPoutPourrit: z.number().optional(),
  codigoSocObraPoutPourrit: z.number().optional(),
})

export type SearchFonogramaFormData = z.infer<typeof searchFonogramaSchema>
