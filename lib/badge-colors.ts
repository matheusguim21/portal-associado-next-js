const green = 'bg-green-100 text-green-800 border border-green-200'
const red = 'bg-red-100 text-red-800 border border-red-200'
const yellow = 'bg-yellow-100 text-yellow-800 border border-yellow-200'
const blue = 'bg-blue-100 text-blue-800 border border-blue-200'
const orange = 'bg-orange-100 text-orange-800 border border-orange-200'
const purple = 'bg-purple-100 text-purple-800 border border-purple-200'
const gray = 'bg-gray-100 text-gray-800 border border-gray-200'
export const defaultBadgeClass = 'bg-muted text-muted-foreground border border-border'
const muted = defaultBadgeClass

const FONOGRAMA_SIGLAS = new Set(['D', 'I', 'L', 'P', 'R', 'V'])

export function isFonogramaSituacaoSigla(sigla?: string | null): boolean {
  return sigla != null && FONOGRAMA_SIGLAS.has(sigla)
}

export function getSituacaoCadastralObraBadgeClass(sigla?: string | null): string {
  switch (sigla) {
    case 'LI':
      return green
    case 'ID':
      return blue
    case 'EC':
      return red
    case 'DU':
      return orange
    case 'PI':
    case 'PV':
      return yellow
    default:
      return gray
  }
}

export function getSituacaoCadastralFonogramaBadgeClass(sigla?: string | null): string {
  switch (sigla) {
    case 'L':
      return green
    case 'I':
      return red
    case 'D':
    case 'P':
    case 'R':
    case 'V':
      return yellow
    default:
      return gray
  }
}

export function getSituacaoCadastralBadgeClass(sigla?: string | null): string {
  if (!sigla) return muted
  if (isFonogramaSituacaoSigla(sigla)) {
    return getSituacaoCadastralFonogramaBadgeClass(sigla)
  }
  return getSituacaoCadastralObraBadgeClass(sigla)
}

export function getArquivoRepertorioStatusBadgeClass(code?: string | null): string {
  switch (code) {
    case 'PROCESSADO':
      return green
    case 'ERRO':
      return red
    case 'PENDENTE':
      return yellow
    case 'GRAVADO':
    case 'ENVIADO':
      return blue
    case 'SALVO':
      return gray
    case 'CAD_TITULAR':
      return orange
    case 'LEITURA':
      return purple
    default:
      return gray
  }
}

export function getArquivoRepertorioTipoBadgeClass(code?: string | null): string {
  switch (code) {
    case 'OBRA_MUSICAL':
      return blue
    case 'POUT_POURRIT':
      return purple
    case 'COLETIVO':
      return orange
    case 'FONOGRAMA':
      return purple
    case 'AUDIOVISUAL':
      return blue
    case 'ECAD_RETORNO':
      return yellow
    case 'TITULAR':
      return green
    default:
      return gray
  }
}

export function getDerivadaBadgeClass(code?: string | null): string {
  switch (code) {
    case 'N':
      return blue
    case 'S':
      return yellow
    default:
      return gray
  }
}

export function getRetidoSituacaoBadgeClass(text?: string | null): string {
  if (!text?.trim()) return muted

  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

  if (normalized.includes('LIBER')) return green
  if (normalized.includes('RETID')) return red
  if (normalized.includes('PENDENT')) return yellow

  return gray
}
