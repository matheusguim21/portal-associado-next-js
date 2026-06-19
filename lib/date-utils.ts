import { format, isValid, parse, parseISO } from 'date-fns'

const DISPLAY_FORMAT = 'dd/MM/yyyy'
const ISO_FORMAT = 'yyyy-MM-dd'

export function formatIsoToDisplay(iso: string): string {
  if (!iso.trim()) return ''
  const date = parseISO(iso)
  if (!isValid(date)) return ''
  return format(date, DISPLAY_FORMAT)
}

export function parseDisplayToIso(display: string): string | undefined {
  const trimmed = display.trim()
  if (!trimmed) return undefined
  const date = parse(trimmed, DISPLAY_FORMAT, new Date())
  if (!isValid(date)) return undefined
  return format(date, ISO_FORMAT)
}

export function parseIsoToDate(iso: string): Date | undefined {
  if (!iso.trim()) return undefined
  const date = parseISO(iso)
  return isValid(date) ? date : undefined
}

export function formatDateToIso(date: Date): string {
  return format(date, ISO_FORMAT)
}
