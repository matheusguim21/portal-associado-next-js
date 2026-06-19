import { isValid, parseISO } from 'date-fns'
import { z } from 'zod'

export const optionalIsoDate = z
  .string()
  .optional()
  .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: 'Data inválida.',
  })
  .refine((v) => !v || isValid(parseISO(v)), {
    message: 'Data inválida.',
  })
