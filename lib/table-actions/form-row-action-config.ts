import { Pencil, Trash2 } from 'lucide-react'

import { createActionsConfig } from '@/lib/create-actions-config'

export const FORM_ROW_ACTIONS = ['edit', 'delete'] as const
export type FormRowAction = (typeof FORM_ROW_ACTIONS)[number]

export const formRowActionsConfig = createActionsConfig<FormRowAction>({
  actionsArray: FORM_ROW_ACTIONS,
  iconMap: {
    edit: Pencil,
    delete: Trash2,
  },
  labelMap: {
    edit: 'Editar',
    delete: 'Excluir',
  },
})
