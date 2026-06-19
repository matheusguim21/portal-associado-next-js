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

export const searchObraMusicalSchema = z.object({
  pesquisa: z.enum(SEARCH_KINDS, { message: 'Tipo de pesquisa é obrigatório' }),
  id: z.number().optional(),
  titulo: z.string().optional(),
  codigoEcad: z.number().optional(),
  nacional: z.enum(['S', 'N']).optional(),
  derivada: z.enum(['N', 'S']).optional(),
  titularId: z.number().optional(),
  titularCodigoEcad: z.number().optional(),
  titularNome: z.string().optional(),
  titularPseudonimo: z.string().optional(),
  status: statusEnum.optional(),
})

export type SearchObraMusicalFormData = z.infer<typeof searchObraMusicalSchema>
