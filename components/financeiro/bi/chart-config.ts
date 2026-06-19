import type { ChartConfig } from '@/components/ui/chart'

export const BI_CHART_COLORS_LIGHT = [
  '#002E3B',
  '#F0C505',
  '#9B7A57',
  '#7DAEBC',
  '#0B5C69',
  '#555555',
  '#8CCDBE',
  '#F1D265',
]

export const BI_CHART_COLORS_DARK = [
  '#157d8f',
  '#F0C505',
  '#C4A882',
  '#9CA3AF',
  '#9BC4D0',
  '#56B4C8',
  '#8CCDBE',
  '#F1D265',
]

/** @deprecated Use getBiChartColors() or useBiChartConfig() */
export const BI_CHART_COLORS = BI_CHART_COLORS_LIGHT

export function getBiChartColors(isDark: boolean) {
  return isDark ? BI_CHART_COLORS_DARK : BI_CHART_COLORS_LIGHT
}

export function buildBiChartConfig(colors: readonly string[] = BI_CHART_COLORS_LIGHT): ChartConfig {
  return {
    distribuicao: { label: 'Distribuição', color: colors[0] },
    retido: { label: 'Liberação de Retido', color: colors[1] },
    ajuste: { label: 'Ajustes', color: colors[2] },
    valor: { label: 'Valor', color: colors[0] },
    valorDistribuicao: { label: 'Distribuição', color: colors[0] },
    valorRetido: { label: 'Liberação de Retido', color: colors[1] },
    valorAjuste: { label: 'Ajustes', color: colors[2] },
  }
}

/** @deprecated Use buildBiChartConfig() */
export const biChartConfig = buildBiChartConfig()

export function buildPieBarConfig(
  items: { label: string; valor: number }[],
  colors: readonly string[] = BI_CHART_COLORS_LIGHT,
): ChartConfig {
  return items.reduce<ChartConfig>((acc, item, index) => {
    const key = item.label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')

    acc[key || `item_${index}`] = {
      label: item.label,
      color: colors[index % colors.length],
    }
    return acc
  }, {})
}

export function toChartData(
  items: {
    label?: string
    descricao?: string
    titulo?: string
    valor?: number
    valorPago?: number
  }[],
  colors: readonly string[] = BI_CHART_COLORS_LIGHT,
) {
  return items.map((item, index) => ({
    label: item.label || item.descricao || item.titulo || `Item ${index + 1}`,
    valor: item.valor ?? item.valorPago ?? 0,
    fill: colors[index % colors.length],
  }))
}
