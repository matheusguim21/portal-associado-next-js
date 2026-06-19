import { Check } from 'lucide-react'

import { createActionsConfig } from '@/lib/create-actions-config'

export const TITULAR_ACTIONS = ['select'] as const
export type TitularAction = (typeof TITULAR_ACTIONS)[number]

export const titularActionsConfig = createActionsConfig<TitularAction>({
  actionsArray: TITULAR_ACTIONS,
  iconMap: {
    select: Check,
  },
  labelMap: {
    select: 'Selecionar',
  },
})
