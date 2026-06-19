import { Check, Eye, Pencil } from 'lucide-react'

import { createActionsConfig } from '@/lib/create-actions-config'
import type { ObraMusicalApi } from '@/types/api/documentacao'

export const OBRA_MUSICAL_ACTIONS = ['view', 'edit', 'select'] as const
export type ObraMusicalAction = (typeof OBRA_MUSICAL_ACTIONS)[number]

export const obraMusicalActionsConfig = createActionsConfig<ObraMusicalAction, ObraMusicalApi>({
  actionsArray: OBRA_MUSICAL_ACTIONS,
  iconMap: {
    view: Eye,
    edit: Pencil,
    select: Check,
  },
  labelMap: {
    view: 'Ver',
    edit: 'Editar',
    select: 'Selecionar',
  },
  disabledMap: {
    edit: (context) => context?.status !== 'CAD_TITULAR',
  },
})

export const obraMusicalCadastroActionsConfig = createActionsConfig<
  ObraMusicalAction,
  ObraMusicalApi
>({
  actionsArray: OBRA_MUSICAL_ACTIONS,
  iconMap: {
    view: Eye,
    edit: Pencil,
    select: Check,
  },
  labelMap: {
    view: 'Ver',
    edit: 'Editar',
    select: 'Selecionar',
  },
  disabledMap: {
    edit: (context) => context?.status !== 'CAD_TITULAR',
  },
  hrefMap: {
    view: (obra) => `/obras/cadastro/${obra.id}`,
    edit: (obra) =>
      obra.status === 'CAD_TITULAR' ? `/obras/cadastro/${obra.id}/editar` : undefined,
  },
})
