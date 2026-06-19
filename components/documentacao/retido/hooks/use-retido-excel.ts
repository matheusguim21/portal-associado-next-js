'use client'

import { useCallback, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useDownloadRetidoAutoralExcel } from '@/api/endpoints/documentacao/retido/use-download-retido-autoral-excel'
import { useDownloadRetidoAutoralExcelTodos } from '@/api/endpoints/documentacao/retido/use-download-retido-autoral-excel-todos'
import { useDownloadRetidoConexoExcel } from '@/api/endpoints/documentacao/retido/use-download-retido-conexo-excel'
import { useDownloadRetidoConexoExcelTodos } from '@/api/endpoints/documentacao/retido/use-download-retido-conexo-excel-todos'
import { useDownloadRetidoTitularExcel } from '@/api/endpoints/documentacao/retido/use-download-retido-titular-excel'
import { useDownloadRetidoTitularExcelTodos } from '@/api/endpoints/documentacao/retido/use-download-retido-titular-excel-todos'
import type { RetidoPesquisaFiltroUrl } from '@/lib/retido-pesquisa'
import { useRetidoSelecaoStore } from '@/stores/use-retido-selecao-store'
import type { RetidoTab } from '@/types/api/documentacao/retido'

interface UseRetidoExcelParams {
  tab: RetidoTab
  appliedFiltro: RetidoPesquisaFiltroUrl
  canFetch: boolean
  totalElements: number | undefined
}

export function useRetidoExcel({
  tab,
  appliedFiltro,
  canFetch,
  totalElements,
}: UseRetidoExcelParams) {
  const [excelOpen, setExcelOpen] = useState(false)

  const clearSelection = useRetidoSelecaoStore((s) => s.clearSelection)
  const selectedCount = useRetidoSelecaoStore((s) => Object.keys(s.itemsByPk).length)
  const pkCodigos = useRetidoSelecaoStore(useShallow((s) => Object.keys(s.itemsByPk)))

  const excelTodosAutoral = useDownloadRetidoAutoralExcelTodos()
  const excelTodosConexo = useDownloadRetidoConexoExcelTodos()
  const excelTodosTitular = useDownloadRetidoTitularExcelTodos()
  const downloadAutoralExcel = useDownloadRetidoAutoralExcel()
  const downloadConexoExcel = useDownloadRetidoConexoExcel()
  const downloadTitularExcel = useDownloadRetidoTitularExcel()

  const excelTodosPending =
    tab === 'autoral'
      ? excelTodosAutoral.isPending
      : tab === 'titular'
        ? excelTodosTitular.isPending
        : excelTodosConexo.isPending

  const canExportTodos = canFetch && totalElements !== undefined && totalElements > 0

  const excelSelectionPending =
    tab === 'autoral'
      ? downloadAutoralExcel.isPending
      : tab === 'titular'
        ? downloadTitularExcel.isPending
        : downloadConexoExcel.isPending

  const handleExportExcelTodos = useCallback(() => {
    const variables = { appliedFiltro }
    if (tab === 'autoral') excelTodosAutoral.mutate(variables)
    else if (tab === 'titular') excelTodosTitular.mutate(variables)
    else excelTodosConexo.mutate(variables)
  }, [appliedFiltro, tab, excelTodosAutoral, excelTodosConexo, excelTodosTitular])

  const handleExcelSelectionConfirm = useCallback(() => {
    const mutation =
      tab === 'autoral'
        ? downloadAutoralExcel
        : tab === 'titular'
          ? downloadTitularExcel
          : downloadConexoExcel
    mutation.mutate(
      { pkCodigos },
      {
        onSuccess: () => {
          clearSelection()
          setExcelOpen(false)
        },
      },
    )
  }, [
    tab,
    pkCodigos,
    downloadAutoralExcel,
    downloadConexoExcel,
    downloadTitularExcel,
    clearSelection,
  ])

  const closeExcelModal = useCallback(() => {
    setExcelOpen(false)
  }, [])

  return {
    excelOpen,
    setExcelOpen,
    closeExcelModal,
    selectedCount,
    pkCodigos,
    clearSelection,
    excelTodosPending,
    canExportTodos,
    excelSelectionPending,
    handleExportExcelTodos,
    handleExcelSelectionConfirm,
  }
}
