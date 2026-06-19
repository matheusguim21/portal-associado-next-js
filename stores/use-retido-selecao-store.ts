import { create } from 'zustand'

export interface RetidoSelecionado {
  pkCodigo: string
  nmObra?: string | null
  compet?: string | null
}

interface RetidoSelecaoState {
  itemsByPk: Record<string, RetidoSelecionado>
  toggleItem: (item: RetidoSelecionado) => void
  addItemIfMissing: (item: RetidoSelecionado) => void
  removeItem: (pkCodigo: string) => void
  clearSelection: () => void
  isSelected: (pkCodigo: string) => boolean
}

export const useRetidoSelecaoStore = create<RetidoSelecaoState>((set, get) => ({
  itemsByPk: {},

  toggleItem: (item) => {
    const pk = item.pkCodigo
    set((state) => {
      const next = { ...state.itemsByPk }
      if (next[pk]) delete next[pk]
      else next[pk] = item
      return { itemsByPk: next }
    })
  },

  addItemIfMissing: (item) => {
    const pk = item.pkCodigo
    set((state) => {
      if (state.itemsByPk[pk]) return state
      return { itemsByPk: { ...state.itemsByPk, [pk]: item } }
    })
  },

  removeItem: (pkCodigo) => {
    set((state) => {
      const next = { ...state.itemsByPk }
      delete next[pkCodigo]
      return { itemsByPk: next }
    })
  },

  clearSelection: () => set({ itemsByPk: {} }),

  isSelected: (pkCodigo) => !!get().itemsByPk[pkCodigo],
}))
