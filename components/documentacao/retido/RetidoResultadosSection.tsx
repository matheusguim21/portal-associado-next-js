import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { SearchResultsToolbar } from '@/components/search-results-toolbar'
import { RetidoToolbar } from '@/components/documentacao/retido/RetidoToolbar'
import { RETIDO_UI_LABELS } from '@/lib/retido-labels'
import type {
  RetAutModel,
  RetConModel,
  RetTitModel,
} from '@/types/api/documentacao/retido'

type RetidoRow = RetAutModel | RetConModel | RetTitModel

interface PaginatedData {
  content: unknown[]
  number: number
  totalPages: number
  totalElements: number
}

interface RetidoResultadosSectionProps {
  canFetch: boolean
  isPending: boolean
  data: PaginatedData | undefined
  page: number
  size: number
  columns: ColumnDef<RetidoRow>[]
  selectedCount: number
  onOpenExcel: () => void
  excelSelectionPending: boolean
  onClearSelection: () => void
  canExportTodos: boolean
  excelTodosPending: boolean
  onExportExcelTodos: () => void
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

export function RetidoResultadosSection({
  canFetch,
  isPending,
  data,
  page,
  size,
  columns,
  selectedCount,
  onOpenExcel,
  excelSelectionPending,
  onClearSelection,
  canExportTodos,
  excelTodosPending,
  onExportExcelTodos,
  onPageChange,
  onSizeChange,
}: RetidoResultadosSectionProps) {
  const labels = RETIDO_UI_LABELS

  return (
    <>
      <RetidoToolbar
        selectedCount={selectedCount}
        onOpenExcel={onOpenExcel}
        excelSelectionPending={excelSelectionPending}
        onClearSelection={onClearSelection}
        canExportTodos={canExportTodos}
        excelTodosPending={excelTodosPending}
        onExportExcelTodos={onExportExcelTodos}
      />

      <div className="w-full max-w-full min-w-0 space-y-3">
        {!canFetch ? (
          <p className="text-sm text-muted-foreground py-6 text-center">{labels.emptyHint}</p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground md:hidden">{labels.scrollHint}</p>
            <DataTable
              columns={columns}
              data={(data?.content ?? []) as RetidoRow[]}
              loading={isPending}
              compact
            />
            {data && data.totalElements > 0 && (
              <SearchResultsToolbar
                page={page}
                size={size}
                totalElements={data.totalElements}
                totalPages={data.totalPages}
                onPageChange={onPageChange}
                onSizeChange={onSizeChange}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
