/** Normaliza ISRC para 12 caracteres alfanuméricos (sem hífens). */
export function normalizeIsrc(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 12)
}

/** Formata ISRC como XX-XXX-XX-XXXX para exibição. */
export function formatIsrc(value: string): string {
  const raw = normalizeIsrc(value)
  if (raw.length <= 2) return raw
  if (raw.length <= 5) return `${raw.slice(0, 2)}-${raw.slice(2)}`
  if (raw.length <= 7) return `${raw.slice(0, 2)}-${raw.slice(2, 5)}-${raw.slice(5)}`
  return `${raw.slice(0, 2)}-${raw.slice(2, 5)}-${raw.slice(5, 7)}-${raw.slice(7)}`
}

/** Normaliza CPF/CNPJ para apenas dígitos (máx. 14). */
export function normalizeCpfCnpj(value: string): string {
  return value.replace(/\D/g, '').slice(0, 14)
}

/** Formata CPF ou CNPJ para exibição. */
export function formatCpfCnpj(value: string): string {
  const digits = normalizeCpfCnpj(value)
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

/** Normaliza celular para apenas dígitos (máx. 11). */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

/** Formata celular como (00) 00000-0000 para exibição. */
export function formatPhone(value: string): string {
  const digits = normalizePhone(value)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/** Normaliza IPI: prefixo I + até 10 dígitos. */
export function normalizeIpi(value: string): string {
  const upper = value.toUpperCase().replace(/[^I0-9]/g, '')
  const withoutPrefix = upper.startsWith('I') ? upper.slice(1) : upper
  const digits = withoutPrefix.replace(/\D/g, '').slice(0, 10)
  return digits ? `I${digits}` : ''
}

/** Formata IPI como I-000000000-0 para exibição. */
export function formatIpi(value: string): string {
  const normalized = normalizeIpi(value)
  if (!normalized) return ''
  const digits = normalized.slice(1)
  if (digits.length <= 9) {
    return `I-${digits}`
  }
  return `I-${digits.slice(0, 9)}-${digits.slice(9)}`
}

/** Normaliza duração para 6 dígitos (mmssff). */
export function normalizeDuration(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6)
}

/** Formata duração como mm:ss:ff para exibição. */
export function formatDuration(value: string): string {
  const digits = normalizeDuration(value)
  if (!digits.length) return ''
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4)}`
}

/** Normaliza data para 8 dígitos (DDMMAAAA). */
export function normalizeDate(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8)
}

/** Formata data como dd/MM/yyyy para exibição. */
export function formatDate(value: string): string {
  const digits = normalizeDate(value)
  if (!digits.length) return ''
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

/** Normaliza mês/ano para 6 dígitos (MMAAAA). */
export function normalizeMonthYear(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6)
}

/** Formata mês/ano como MM/AAAA para exibição. */
export function formatMonthYear(value: string): string {
  const digits = normalizeMonthYear(value)
  if (!digits.length) return ''
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

/** Normaliza valor numérico para apenas dígitos. */
export function normalizeNumeric(value: string, maxDigits = 8): string {
  return value.replace(/\D/g, '').slice(0, maxDigits)
}

/** Formata valor numérico (sem separadores). */
export function formatNumeric(value: string, maxDigits = 8): string {
  return normalizeNumeric(value, maxDigits)
}

export type InputMaskType =
  | 'isrc'
  | 'cpfCnpj'
  | 'phone'
  | 'ipi'
  | 'duration'
  | 'date'
  | 'monthYear'
  | 'numeric'

export type MaskOptions = {
  maxDigits?: number
}

export function normalizeMaskedValue(
  mask: InputMaskType,
  value: string,
  options?: MaskOptions,
): string {
  switch (mask) {
    case 'isrc':
      return normalizeIsrc(value)
    case 'cpfCnpj':
      return normalizeCpfCnpj(value)
    case 'phone':
      return normalizePhone(value)
    case 'ipi':
      return normalizeIpi(value)
    case 'duration':
      return normalizeDuration(value)
    case 'date':
      return normalizeDate(value)
    case 'monthYear':
      return normalizeMonthYear(value)
    case 'numeric':
      return normalizeNumeric(value, options?.maxDigits ?? 8)
  }
}

export function formatMaskedValue(
  mask: InputMaskType,
  value: string,
  options?: MaskOptions,
): string {
  switch (mask) {
    case 'isrc':
      return formatIsrc(value)
    case 'cpfCnpj':
      return formatCpfCnpj(value)
    case 'phone':
      return formatPhone(value)
    case 'ipi':
      return formatIpi(value)
    case 'duration':
      return formatDuration(value)
    case 'date':
      return formatDate(value)
    case 'monthYear':
      return formatMonthYear(value)
    case 'numeric':
      return formatNumeric(value, options?.maxDigits ?? 8)
  }
}

export function maxLengthForMask(mask: InputMaskType): number | undefined {
  switch (mask) {
    case 'isrc':
      return 15
    case 'cpfCnpj':
      return 18
    case 'phone':
      return 15
    case 'ipi':
      return 13
    case 'duration':
      return 8
    case 'date':
      return 10
    case 'monthYear':
      return 7
    case 'numeric':
      return undefined
  }
}
