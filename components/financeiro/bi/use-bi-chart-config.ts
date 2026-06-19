'use client'

import { useTheme } from '@teispace/next-themes'
import { useMemo } from 'react'
import {
  buildBiChartConfig,
  buildPieBarConfig,
  getBiChartColors,
  toChartData,
} from '@/components/financeiro/bi/chart-config'

export function useBiChartConfig() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const colors = useMemo(() => getBiChartColors(isDark), [isDark])

  return useMemo(
    () => ({
      colors,
      biChartConfig: buildBiChartConfig(colors),
      buildPieBarConfig: (items: { label: string; valor: number }[]) =>
        buildPieBarConfig(items, colors),
      toChartData: (
        items: {
          label?: string
          descricao?: string
          titulo?: string
          valor?: number
          valorPago?: number
        }[],
      ) => toChartData(items, colors),
    }),
    [colors],
  )
}
