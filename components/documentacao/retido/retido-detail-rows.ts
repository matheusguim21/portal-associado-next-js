import { formatRetidoCompet } from '@/components/documentacao/retido/retido-columns-shared'
import { RETIDO_UI_LABELS } from '@/lib/retido-labels'
import { pkCodigoToString } from '@/lib/retido-pesquisa'
import type {
  RetAutModel,
  RetConModel,
  RetidoTab,
  RetTitModel,
} from '@/types/api/documentacao/retido'
import { format, parseISO } from 'date-fns'

export type RetidoDetailRow = {
  label: string
  value: string
}

function formatDetailValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function formatDetailDate(value: string | null | undefined): string {
  if (!value) return '—'
  try {
    return format(parseISO(value), 'dd/MM/yyyy')
  } catch {
    return value
  }
}

export function buildRetidoDetailRows(
  row: RetAutModel | RetConModel | RetTitModel,
  tab: RetidoTab,
): RetidoDetailRow[] {
  const isConexo = tab === 'conexo'
  const isTitular = tab === 'titular'
  const conexo = isConexo ? (row as RetConModel) : null
  const titular = isTitular ? (row as RetTitModel) : null
  const labels = RETIDO_UI_LABELS.columns
  const detail = RETIDO_UI_LABELS.detailModal

  const rows: RetidoDetailRow[] = [
    {
      label: labels.pkCodigo,
      value: formatDetailValue(pkCodigoToString(row.pkCodigo)),
    },
    {
      label: labels.compet,
      value: formatDetailValue(formatRetidoCompet(row.compet)),
    },
    { label: labels.rubrica, value: formatDetailValue(row.rubrica) },
    { label: labels.nmObra, value: formatDetailValue(row.nmObra) },
    { label: detail.nmAudio, value: formatDetailValue(row.nmAudio) },
    { label: detail.nroOcor, value: formatDetailValue(row.nroOcor) },
    { label: labels.dscPlano, value: formatDetailValue(row.dscPlano) },
    { label: detail.perDe, value: formatDetailDate(row.perDe) },
    { label: detail.perAte, value: formatDetailDate(row.perAte) },
  ]

  if (isTitular && titular) {
    rows.push(
      { label: labels.categoria, value: formatDetailValue(titular.categoria) },
      { label: labels.cdTitular, value: formatDetailValue(titular.cdTitular) },
      { label: labels.nmTitular, value: formatDetailValue(titular.nmTitular) },
    )
  }

  if (isConexo && conexo) {
    rows.push({
      label: labels.refGravadora,
      value: formatDetailValue(conexo.refGravadora),
    })
  }

  rows.push(
    { label: labels.refAutoral, value: formatDetailValue(row.refAutoral) },
    { label: labels.refInterprete, value: formatDetailValue(row.refInterprete) },
    { label: labels.situacao, value: formatDetailValue(row.situacao) },
    { label: detail.motivoRetencao, value: formatDetailValue(row.motivoRetencao) },
  )

  return rows
}
