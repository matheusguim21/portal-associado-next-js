import type { LucideIcon } from 'lucide-react'

/**
 * Contexto opcional passado para isDisabled. Pode conter qualquer chave
 * (status, pgtoRealizado, etc.) conforme a necessidade de cada config.
 */
export type DisabledContext = Record<string, unknown>

export type ActionConfig<I = unknown> = {
  Icon: LucideIcon
  tooltip: string
  isDisabled: (context?: DisabledContext) => boolean
  getHref?: (item: I) => string | undefined
}

type ActionConfigInput<A extends string, I> = {
  actionsArray: readonly A[]
  iconMap: Record<A, LucideIcon>
  labelMap: Record<A, string>
  disabledMap?: Partial<Record<A, (context?: DisabledContext) => boolean>>
  hrefMap?: Partial<Record<A, (item: I) => string | undefined>>
}

export function createActionsConfig<A extends string, I = unknown>({
  actionsArray,
  iconMap,
  labelMap,
  disabledMap = {},
  hrefMap = {},
}: ActionConfigInput<A, I>): Record<A, ActionConfig<I>> {
  return actionsArray.reduce(
    (acc, action) => {
      const Icon = iconMap[action]
      if (!Icon) {
        throw new Error(`Ícone não encontrado para a action "${action}"`)
      }

      const tooltip = labelMap[action]
      if (!tooltip) {
        throw new Error(`Label não encontrado para a action "${action}"`)
      }

      const isDisabledFn = disabledMap[action] ?? (() => false)
      const getHref = hrefMap[action]

      acc[action] = {
        Icon,
        tooltip,
        isDisabled: isDisabledFn,
        ...(getHref ? { getHref } : {}),
      }
      return acc
    },
    {} as Record<A, ActionConfig<I>>,
  )
}
