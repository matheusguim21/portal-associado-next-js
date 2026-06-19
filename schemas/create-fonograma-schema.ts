import { z } from 'zod'
import { normalizeDuration, normalizeIsrc } from '@/lib/masks'

export const createFonogramaSchema = z.object({
  tipoObmPop: z.enum(['OBRA_MUSICAL', 'POUT_POURRIT']),
  obraTitulo: z.string().min(1, 'Selecione uma obra musical ou pout-pourrit.'),
  codigoSocObraPoutPourrit: z
    .number()
    .optional()
    .refine((v) => v != null && v > 0, {
      message: 'Selecione uma obra musical ou pout-pourrit.',
    }),
  codigoEcadObraPoutPourrit: z.number().optional(),
  isrc: z
    .string()
    .optional()
    .refine((v) => !v || normalizeIsrc(v).length === 12, {
      message: 'ISRC deve conter 12 caracteres.',
    }),
  duracao: z
    .string()
    .optional()
    .refine((v) => !v || normalizeDuration(v).length === 6, {
      message: 'Duração deve ter 6 dígitos (mm:ss:ff).',
    }),
  gra: z.string().optional(),
  nacional: z.boolean(),
  instrumental: z.boolean(),
})

export type CreateFonogramaFormData = z.infer<typeof createFonogramaSchema>

export const createFonogramaDefaultValues: CreateFonogramaFormData = {
  tipoObmPop: 'OBRA_MUSICAL',
  obraTitulo: '',
  codigoSocObraPoutPourrit: undefined,
  codigoEcadObraPoutPourrit: undefined,
  isrc: '',
  duracao: '',
  gra: '',
  nacional: true,
  instrumental: false,
}

export const fonogramaCadastroSteps = [
  {
    id: 'obra',
    title: 'Obra vinculada',
    description: 'Obra musical ou pout-pourrit',
  },
  {
    id: 'dados',
    title: 'Dados do fonograma',
    description: 'ISRC e classificação',
  },
  {
    id: 'revisao',
    title: 'Revisão',
    description: 'Confirme antes de enviar',
  },
] as const

export const obraStepSchema = createFonogramaSchema.pick({
  tipoObmPop: true,
  obraTitulo: true,
  codigoSocObraPoutPourrit: true,
})

export const dadosStepSchema = createFonogramaSchema.pick({
  isrc: true,
  duracao: true,
  gra: true,
  nacional: true,
  instrumental: true,
})
