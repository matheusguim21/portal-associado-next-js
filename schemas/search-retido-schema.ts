import { z } from 'zod'
import {
  retidoExigePesquisa1Autoral,
  retidoExigePesquisa1Conexo,
  retidoExigePesquisa1Titular,
  retidoExigePesquisa2Autoral,
  retidoExigePesquisa2Conexo,
  retidoExigePesquisa2Titular,
} from '@/lib/retido-pesquisa'
import type { RetidoTab } from '@/types/api/documentacao/retido'
import {
  CONCATENACAO_PESQUISA_VALUES,
  PESQUISA_RETIDO_VALUES,
  SELECAO_DIGITAL_VALUES,
} from '@/types/api/documentacao/retido'

const REQUIRED = 'required' as const

const concatenacaoSchema = z.union([z.literal(''), z.enum(CONCATENACAO_PESQUISA_VALUES)])

export function createRetidoSearchSchema(tab: RetidoTab) {
  return z
    .object({
      retidoOrdenacao1: z.string().min(1, REQUIRED),
      pesquisa1: z.string(),
      texto1: z.string().min(1, REQUIRED),
      concatenacaoPesquisa: concatenacaoSchema,
      retidoOrdenacao2: z.string(),
      pesquisa2: z.string(),
      texto2: z.string(),
      selecaoDigital: z.enum(SELECAO_DIGITAL_VALUES),
    })
    .superRefine((data, ctx) => {
      const exige1 =
        tab === 'autoral'
          ? retidoExigePesquisa1Autoral(data.retidoOrdenacao1)
          : tab === 'titular'
            ? retidoExigePesquisa1Titular(data.retidoOrdenacao1)
            : retidoExigePesquisa1Conexo(data.retidoOrdenacao1)
      if (
        exige1 &&
        (data.pesquisa1.trim() === '' ||
          !(PESQUISA_RETIDO_VALUES as readonly string[]).includes(data.pesquisa1))
      ) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['pesquisa1'], message: REQUIRED })
      }

      const showSegundoBloco = Boolean(data.concatenacaoPesquisa?.trim())
      if (!showSegundoBloco) return

      if (data.retidoOrdenacao2.trim() === '') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['retidoOrdenacao2'], message: REQUIRED })
      }

      const exige2 =
        tab === 'autoral'
          ? retidoExigePesquisa2Autoral(data.retidoOrdenacao2)
          : tab === 'titular'
            ? retidoExigePesquisa2Titular(data.retidoOrdenacao2)
            : retidoExigePesquisa2Conexo(data.retidoOrdenacao2)
      if (
        exige2 &&
        (data.pesquisa2.trim() === '' ||
          !(PESQUISA_RETIDO_VALUES as readonly string[]).includes(data.pesquisa2))
      ) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['pesquisa2'], message: REQUIRED })
      }

      if (data.texto2.trim() === '') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['texto2'], message: REQUIRED })
      }
    })
}

export type RetidoSearchFormValues = z.infer<ReturnType<typeof createRetidoSearchSchema>>
