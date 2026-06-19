import { Check } from 'lucide-react'

import { createActionsConfig } from '@/lib/create-actions-config'

export const POUT_POURRIT_ACTIONS = ['select'] as const
export type PoutPourritAction = (typeof POUT_POURRIT_ACTIONS)[number]

export const poutPourritActionsConfig = createActionsConfig<PoutPourritAction>({
  actionsArray: POUT_POURRIT_ACTIONS,
  iconMap: {
    select: Check,
  },
  labelMap: {
    select: 'Selecionar',
  },
})
