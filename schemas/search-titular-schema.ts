import { z } from 'zod'
import { SEARCH_KINDS } from '@/types/api/search'

export const HOLDER_STATUSES = ['A', 'I'] as const

export type HolderStatus = (typeof HOLDER_STATUSES)[number]

const optionalString = () =>
  z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined
      const trimmed = val.trim()
      return trimmed === '' ? undefined : trimmed
    })

export const searchTitularSchema = z.object({
  pesquisa: z.enum(SEARCH_KINDS, { message: 'Tipo de pesquisa é obrigatório' }),
  nome: optionalString(),
  email: optionalString(),
  pseudonimo: optionalString(),
  cpfCnpj: optionalString(),
  celular: optionalString(),
  id: optionalString(),
  codigoEcad: optionalString(),
  codigoCae: optionalString(),
  codigoIpi: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined
      const trimmed = val.trim()
      if (trimmed === '') return undefined
      return trimmed.startsWith('I') ? trimmed : `I${trimmed}`
    }),
  codigoIpn: optionalString(),
  nacional: optionalString(),
  situacaoCadastro: z
    .union([z.enum(HOLDER_STATUSES), z.literal('')])
    .optional()
    .transform((val) => (val === '' || val === undefined ? undefined : val)),
})

export type SearchTitularFormInput = z.input<typeof searchTitularSchema>
export type SearchTitularFormData = z.output<typeof searchTitularSchema>
