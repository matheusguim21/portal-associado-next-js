'use client'

import { useCallback, useMemo, useState } from 'react'
import { createRetidoAutoralColumns } from '@/components/documentacao/retido/columns-autoral'
import { createRetidoConexoColumns } from '@/components/documentacao/retido/columns-conexo'
import { createRetidoTitularColumns } from '@/components/documentacao/retido/columns-titular'
import type {
  RetAutModel,
  RetConModel,
  RetidoTab,
  RetTitModel,
} from '@/types/api/documentacao/retido'
import type { SortParam } from '@/types/api/search'

interface UseRetidoTableColumnsParams {
  tab: RetidoTab
  isPending: boolean
  sortParam: SortParam | null
  onSort: (columnId: string) => void
}

export function useRetidoTableColumns({
  tab,
  isPending,
  sortParam,
  onSort,
}: UseRetidoTableColumnsParams) {
  const [detailRow, setDetailRow] = useState<
    RetAutModel | RetConModel | RetTitModel | null
  >(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const openAutoralDetail = useCallback((row: RetAutModel) => {
    setDetailRow(row)
    setDetailOpen(true)
  }, [])

  const openConexoDetail = useCallback((row: RetConModel) => {
    setDetailRow(row)
    setDetailOpen(true)
  }, [])

  const openTitularDetail = useCallback((row: RetTitModel) => {
    setDetailRow(row)
    setDetailOpen(true)
  }, [])

  const closeDetail = useCallback(() => {
    setDetailRow(null)
    setDetailOpen(false)
  }, [])

  const handleRetidoColumnSort = useCallback(
    (columnId: string) => {
      onSort(columnId)
    },
    [onSort],
  )

  const columnsAutoral = useMemo(
    () =>
      createRetidoAutoralColumns(
        openAutoralDetail,
        sortParam,
        handleRetidoColumnSort,
        isPending,
      ),
    [openAutoralDetail, sortParam, handleRetidoColumnSort, isPending],
  )

  const columnsConexo = useMemo(
    () =>
      createRetidoConexoColumns(
        openConexoDetail,
        sortParam,
        handleRetidoColumnSort,
        isPending,
      ),
    [openConexoDetail, sortParam, handleRetidoColumnSort, isPending],
  )

  const columnsTitular = useMemo(
    () =>
      createRetidoTitularColumns(
        openTitularDetail,
        sortParam,
        handleRetidoColumnSort,
        isPending,
      ),
    [openTitularDetail, sortParam, handleRetidoColumnSort, isPending],
  )

  const columns =
    tab === 'autoral'
      ? columnsAutoral
      : tab === 'titular'
        ? columnsTitular
        : columnsConexo

  return {
    columns,
    detailRow,
    detailOpen,
    setDetailOpen,
    closeDetail,
  }
}
