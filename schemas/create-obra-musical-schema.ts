import { z } from 'zod'
import { normalizeDuration } from '@/lib/masks'
import { optionalIsoDate } from '@/schemas/optional-iso-date'

const simNaoBoolean = z.boolean()

export const obraMusicalTitularItemSchema = z.object({
  titularId: z.number().optional(),
  titularNome: z.string().optional(),
  codigoEcad: z.number().optional(),
  subcategoriaCodigo: z.string().min(1, 'Selecione a subcategoria.'),
  percentual: z.number().min(0).max(100),
  dtInicio: optionalIsoDate,
})

export const obraMusicalSubtituloItemSchema = z.object({
  subtitulo: z.string().min(1, 'Informe o subtítulo.').max(95),
  tipoTitulo: z.string().min(1, 'Selecione o tipo de título.'),
})

export const obraMusicalReferenciaItemSchema = z.object({
  referencia: z.string().min(1, 'Informe a referência.'),
  categoriaCodigo: z.string().min(1, 'Selecione a categoria.'),
})

export const obraMusicalElementoIaItemSchema = z.object({
  elementoCodigo: z.string().min(1, 'Selecione o elemento.'),
  ferramentas: z.string().optional(),
  observacao: z.string().optional(),
  promptFiles: z.array(z.custom<File>((v) => v instanceof File)).optional(),
})

export const createObraMusicalBaseSchema = z.object({
  titulo: z.string().min(1, 'O título da obra é obrigatório.').max(95),
  duracao: z
    .string()
    .optional()
    .refine((v) => !v || normalizeDuration(v).length === 6, {
      message: 'Duração deve ter 6 dígitos (mm:ss:ff).',
    }),
  nacional: simNaoBoolean,
  instrumental: simNaoBoolean,
  dtCriacao: optionalIsoDate,
  generoMusicalCodigo: z.string().optional(),
  idiomaSigla: z.string().optional(),
  composta: simNaoBoolean,
  tipoObraComposta: z.string().optional(),
  derivada: z.enum(['N', 'S']),
  obraOriginalId: z.number().optional(),
  obraOriginalTitulo: z.string().optional(),
  obraOriginalCodigoEcad: z.number().optional(),
  usoIA: simNaoBoolean,
  tpUsoIA: z.enum(['T', 'P']).optional(),
  linkAudio: z.string().max(180).optional(),
  letraFile: z.custom<File | null>().optional(),
  contratoFile: z.custom<File | null>().optional(),
  audioFile: z.custom<File | null>().optional(),
  titulares: z.array(obraMusicalTitularItemSchema),
  subtitulos: z.array(obraMusicalSubtituloItemSchema),
  referencias: z.array(obraMusicalReferenciaItemSchema),
  elementosIa: z.array(obraMusicalElementoIaItemSchema),
})

export const createObraMusicalSchema = createObraMusicalBaseSchema.superRefine((data, ctx) => {
    if (data.derivada === 'S' && !data.obraOriginalId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione a obra original para obra derivada.',
        path: ['obraOriginalId'],
      })
    }
    if (data.composta && !data.tipoObraComposta) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o tipo de obra composta.',
        path: ['tipoObraComposta'],
      })
    }
    if (data.usoIA) {
      if (!data.tpUsoIA) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione o tipo de uso de IA.',
          path: ['tpUsoIA'],
        })
      }
      if (data.elementosIa.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe ao menos um elemento de IA.',
          path: ['elementosIa'],
        })
      }
    }
    if (data.titulares.length > 0) {
      const total = data.titulares.reduce((sum, t) => sum + (t.percentual ?? 0), 0)
      if (Math.abs(total - 100) > 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A soma dos percentuais dos titulares deve ser 100%.',
          path: ['titulares'],
        })
      }
    }
  })

export type CreateObraMusicalFormData = z.infer<typeof createObraMusicalSchema>
export type ObraMusicalTitularItem = z.infer<typeof obraMusicalTitularItemSchema>
export type ObraMusicalSubtituloItem = z.infer<typeof obraMusicalSubtituloItemSchema>
export type ObraMusicalReferenciaItem = z.infer<typeof obraMusicalReferenciaItemSchema>
export type ObraMusicalElementoIaItem = z.infer<typeof obraMusicalElementoIaItemSchema>

export const createObraMusicalDefaultValues: CreateObraMusicalFormData = {
  titulo: '',
  duracao: '',
  nacional: true,
  instrumental: false,
  dtCriacao: '',
  generoMusicalCodigo: '',
  idiomaSigla: '',
  composta: false,
  tipoObraComposta: '',
  derivada: 'N',
  obraOriginalId: undefined,
  obraOriginalTitulo: '',
  obraOriginalCodigoEcad: undefined,
  usoIA: false,
  tpUsoIA: undefined,
  linkAudio: '',
  letraFile: null,
  contratoFile: null,
  audioFile: null,
  titulares: [],
  subtitulos: [],
  referencias: [],
  elementosIa: [],
}

export const obraMusicalCadastroSteps = [
  { id: 'dados', title: 'Obra Musical', description: 'Dados principais e anexos' },
  { id: 'titulares', title: 'Titulares', description: 'Participação e percentuais' },
  { id: 'subtitulo', title: 'Subtítulo', description: 'Subtítulos da obra' },
  { id: 'referencia', title: 'Referência', description: 'Referências da obra' },
  { id: 'ia', title: 'IA', description: 'Uso de IA, áudio e elementos' },
  { id: 'revisao', title: 'Revisão', description: 'Confirme antes de enviar' },
] as const

export const dadosStepSchema = createObraMusicalBaseSchema
  .pick({
    titulo: true,
    duracao: true,
    nacional: true,
    instrumental: true,
    dtCriacao: true,
    generoMusicalCodigo: true,
    idiomaSigla: true,
    composta: true,
    tipoObraComposta: true,
    derivada: true,
    obraOriginalId: true,
  })
  .superRefine((data, ctx) => {
    if (data.derivada === 'S' && !data.obraOriginalId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione a obra original para obra derivada.',
        path: ['obraOriginalId'],
      })
    }
    if (data.composta && !data.tipoObraComposta) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o tipo de obra composta.',
        path: ['tipoObraComposta'],
      })
    }
  })

export const titularesStepSchema = createObraMusicalBaseSchema
  .pick({ titulares: true })
  .superRefine((data, ctx) => {
    if (data.titulares.length > 0) {
      const total = data.titulares.reduce((sum, t) => sum + (t.percentual ?? 0), 0)
      if (Math.abs(total - 100) > 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A soma dos percentuais dos titulares deve ser 100%.',
          path: ['titulares'],
        })
      }
    }
  })

export const subtitulosStepSchema = createObraMusicalBaseSchema.pick({ subtitulos: true })
export const referenciasStepSchema = createObraMusicalBaseSchema.pick({ referencias: true })

export const iaStepSchema = createObraMusicalBaseSchema
  .pick({ usoIA: true, tpUsoIA: true, linkAudio: true, elementosIa: true })
  .superRefine((data, ctx) => {
    if (data.usoIA) {
      if (!data.tpUsoIA) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione o tipo de uso de IA.',
          path: ['tpUsoIA'],
        })
      }
      if (data.elementosIa.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe ao menos um elemento de IA.',
          path: ['elementosIa'],
        })
      }
    }
  })
