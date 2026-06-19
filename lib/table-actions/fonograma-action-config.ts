import { Eye } from 'lucide-react'

import { createActionsConfig } from '@/lib/create-actions-config'

export const FONOGRAMA_ACTIONS = ['view'] as const
export type FonogramaAction = (typeof FONOGRAMA_ACTIONS)[number]

export const fonogramaActionsConfig = createActionsConfig<FonogramaAction>({
  actionsArray: FONOGRAMA_ACTIONS,
  iconMap: {
    view: Eye,
  },
  labelMap: {
    view: 'Ver',
  },
})
