export const CHART_HEIGHT_CLASS = 'aspect-auto h-[min(360px,45vh)] min-h-[280px] w-full max-w-none'

export type ReportChartDataItem = Record<string, string | number>

export const PERIOD_AXIS_PROPS = {
  interval: 0,
  minTickGap: 0,
  tick: { fontSize: 11 },
} as const

export const CATEGORY_AXIS_PROPS = {
  interval: 0,
  minTickGap: 0,
  tick: { fontSize: 11 },
  padding: { left: 32, right: 32 },
} as const

export function truncateChartLabel(value: string, maxLength = 16) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value
}

export const CHART_OVERFLOW_VISIBLE_CLASS =
  '[&_.recharts-wrapper]:overflow-visible [&_.recharts-surface]:overflow-visible'
