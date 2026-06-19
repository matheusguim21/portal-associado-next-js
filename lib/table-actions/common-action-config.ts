import { Check, Download, Eye, Pencil, Trash2 } from 'lucide-react'

import { createActionsConfig } from '@/lib/create-actions-config'

export const COMMON_ACTIONS = ['view', 'edit', 'select', 'delete', 'download'] as const
export type CommonAction = (typeof COMMON_ACTIONS)[number]

export const COMMON_ACTION_LABELS: Record<CommonAction, string> = {
  view: 'Ver',
  edit: 'Editar',
  select: 'Selecionar',
  delete: 'Excluir',
  download: 'Baixar PDF',
}

export const commonActionConfig = createActionsConfig<CommonAction>({
  actionsArray: COMMON_ACTIONS,
  iconMap: {
    view: Eye,
    edit: Pencil,
    select: Check,
    delete: Trash2,
    download: Download,
  },
  labelMap: COMMON_ACTION_LABELS,
})
