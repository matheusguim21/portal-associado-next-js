import { Eye } from 'lucide-react'

import { createActionsConfig } from '@/lib/create-actions-config'

export const RETIDO_ACTIONS = ['viewDetail'] as const
export type RetidoAction = (typeof RETIDO_ACTIONS)[number]

export const retidoActionsConfig = createActionsConfig<RetidoAction>({
  actionsArray: RETIDO_ACTIONS,
  iconMap: {
    viewDetail: Eye,
  },
  labelMap: {
    viewDetail: 'Ver detalhes',
  },
})
