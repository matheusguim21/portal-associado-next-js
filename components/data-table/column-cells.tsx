import type { ReactNode } from 'react'
import { StatusBadge } from '@/components/status-badge'
import {
  getArquivoRepertorioStatusBadgeClass,
  getArquivoRepertorioTipoBadgeClass,
  getDerivadaBadgeClass,
  getRetidoSituacaoBadgeClass,
  getSituacaoCadastralBadgeClass,
} from '@/lib/badge-colors'
import {
  getArquivoRepertorioStatusLabel,
  getArquivoRepertorioTipoLabel,
  getDerivadaLabel,
  getSituacaoCadastralKey,
  getSituacaoCadastralLabel,
} from '@/lib/enum-labels'

type SituacaoCadastral = {
  sigla?: string | null
  descricao?: string | null
  codigo?: string | null
}

export function MonoCell({ value }: { value: ReactNode }) {
  return <span className="font-mono text-xs">{value ?? '—'}</span>
}

export function SituacaoCell({
  situacaoCadastral,
}: {
  situacaoCadastral?: SituacaoCadastral | null
}) {
  const label = getSituacaoCadastralLabel(situacaoCadastral)

  if (label === '—') {
    return <span>—</span>
  }

  return (
    <StatusBadge
      label={label}
      colorKey={getSituacaoCadastralKey(situacaoCadastral)}
      getColorClass={getSituacaoCadastralBadgeClass}
    />
  )
}

export function ArquivoRepertorioStatusCell({
  status,
}: {
  status?: string | null
}) {
  const label = getArquivoRepertorioStatusLabel(status)

  if (label === '—') {
    return <span>—</span>
  }

  return (
    <StatusBadge
      label={label}
      colorKey={status}
      getColorClass={getArquivoRepertorioStatusBadgeClass}
    />
  )
}

export function ArquivoRepertorioTipoCell({
  tipo,
}: {
  tipo?: string | null
}) {
  const label = getArquivoRepertorioTipoLabel(tipo)

  if (label === '—') {
    return <span>—</span>
  }

  return (
    <StatusBadge
      label={label}
      colorKey={tipo}
      getColorClass={getArquivoRepertorioTipoBadgeClass}
    />
  )
}

export function DerivadaCell({ derivada }: { derivada?: string | null }) {
  const label = getDerivadaLabel(derivada)

  if (label === '—') {
    return <span>—</span>
  }

  return (
    <StatusBadge
      label={label}
      colorKey={derivada}
      getColorClass={getDerivadaBadgeClass}
    />
  )
}

export function RetidoSituacaoCell({ situacao }: { situacao?: string | null }) {
  const text = situacao?.trim()

  if (!text) {
    return <span>—</span>
  }

  return (
    <StatusBadge
      label={text}
      colorKey={text}
      getColorClass={getRetidoSituacaoBadgeClass}
    />
  )
}
