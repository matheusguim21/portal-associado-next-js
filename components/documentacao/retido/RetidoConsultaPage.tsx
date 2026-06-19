'use client'

import { Suspense, useCallback } from 'react'
import { PageHeader } from '@/components/page-header'
import { RetidoSearchForm } from '@/components/documentacao/retido/RetidoSearchForm'
import { RetidoResultadosSection } from '@/components/documentacao/retido/RetidoResultadosSection'
import { RetidoRowDetailModal } from '@/components/documentacao/retido/RetidoRowDetailModal'
import { GenerateRetidoExcelModal } from '@/components/documentacao/retido/GenerateRetidoExcelModal'
import { useRetidoExcel } from '@/components/documentacao/retido/hooks/use-retido-excel'
import { useRetidoPesquisaFiltros } from '@/components/documentacao/retido/hooks/use-retido-pesquisa-filtros'
import { useRetidoPesquisaQuery } from '@/components/documentacao/retido/hooks/use-retido-pesquisa-query'
import { useRetidoTableColumns } from '@/components/documentacao/retido/hooks/use-retido-table-columns'
import type { SortParam } from '@/types/api/search'

function RetidoConsultaContent() {
  const {
    tab,
    appliedFiltro,
    searchRequestId,
    initialFormValues,
    retidoFormGetValuesRef,
    handleSubmit,
    handleClear: clearFiltros,
    handleTabChange: changeTab,
    setSearchParams,
    searchParams,
  } = useRetidoPesquisaFiltros()

  const page = parseInt(searchParams.get('page') ?? '0', 10)
  const size = parseInt(searchParams.get('size') ?? '10', 10)
  const sortParam = (searchParams.get('sort') as SortParam | null) ?? null

  const {
    canFetch,
    data,
    isPending,
    resetAll,
    handlePageChange,
    handleSizeChange,
    handleSort,
  } = useRetidoPesquisaQuery({
    tab,
    appliedFiltro,
    searchRequestId,
    page,
    size,
    sortParam,
    searchParams,
    setSearchParams,
  })

  const { columns, detailRow, detailOpen, setDetailOpen, closeDetail } =
    useRetidoTableColumns({
      tab,
      isPending,
      sortParam,
      onSort: handleSort,
    })

  const {
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
  } = useRetidoExcel({
    tab,
    appliedFiltro,
    canFetch,
    totalElements: data?.totalElements,
  })

  const handleTabChange = useCallback(
    (value: string) => {
      changeTab(value)
      clearSelection()
      closeDetail()
      closeExcelModal()
    },
    [changeTab, clearSelection, closeDetail, closeExcelModal],
  )

  const handleClear = useCallback(() => {
    clearSelection()
    clearFiltros()
    closeDetail()
    closeExcelModal()
    resetAll()
  }, [clearSelection, clearFiltros, closeDetail, closeExcelModal, resetAll])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Retido"
        description="Pesquise valores retidos por critérios autoral, conexo ou titular."
      />

      <RetidoSearchForm
        tab={tab}
        formGetValuesRef={retidoFormGetValuesRef}
        onModoPesquisaChange={handleTabChange}
        onSubmit={handleSubmit}
        onClear={handleClear}
        isPending={isPending}
        initialValues={initialFormValues}
      />

      <RetidoResultadosSection
        canFetch={canFetch}
        isPending={isPending}
        data={data}
        page={page}
        size={size}
        columns={columns}
        selectedCount={selectedCount}
        onOpenExcel={() => setExcelOpen(true)}
        excelSelectionPending={excelSelectionPending}
        onClearSelection={clearSelection}
        canExportTodos={canExportTodos}
        excelTodosPending={excelTodosPending}
        onExportExcelTodos={handleExportExcelTodos}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
      />

      <RetidoRowDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        tab={tab}
        row={detailRow}
      />

      <GenerateRetidoExcelModal
        open={excelOpen}
        onOpenChange={setExcelOpen}
        pkCodigos={pkCodigos}
        isPending={excelSelectionPending}
        onConfirm={handleExcelSelectionConfirm}
      />
    </div>
  )
}

export function RetidoConsultaPage() {
  return (
    <Suspense fallback={null}>
      <RetidoConsultaContent />
    </Suspense>
  )
}
