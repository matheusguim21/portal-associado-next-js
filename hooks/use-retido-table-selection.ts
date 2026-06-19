'use client'

import {
  useRetidoSelecaoStore,
  type RetidoSelecionado,
} from '@/stores/use-retido-selecao-store'

export function useRetidoTableSelection() {
  const itemsByPk = useRetidoSelecaoStore((s) => s.itemsByPk)
  const toggleItem = useRetidoSelecaoStore((s) => s.toggleItem)
  const addItemIfMissing = useRetidoSelecaoStore((s) => s.addItemIfMissing)
  const removeItem = useRetidoSelecaoStore((s) => s.removeItem)

  return {
    isSelected: (pk: string) => !!itemsByPk[pk],
    toggleItem,
    addItemIfMissing,
    removeItem,
  }
}

export type { RetidoSelecionado }
