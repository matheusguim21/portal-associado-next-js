import { Download } from 'lucide-react'

import { createActionsConfig } from '@/lib/create-actions-config'

export const DEMONSTRATIVO_ECAD_ACTIONS = ['download'] as const
export type DemonstrativoEcadAction = (typeof DEMONSTRATIVO_ECAD_ACTIONS)[number]

export const demonstrativoEcadActionsConfig = createActionsConfig<DemonstrativoEcadAction>({
  actionsArray: DEMONSTRATIVO_ECAD_ACTIONS,
  iconMap: {
    download: Download,
  },
  labelMap: {
    download: 'Baixar PDF',
  },
})
