import { FileSpreadsheet, ListChecks, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RETIDO_UI_LABELS } from '@/lib/retido-labels'

interface RetidoToolbarProps {
  selectedCount: number
  onOpenExcel: () => void
  excelSelectionPending: boolean
  onClearSelection: () => void
  canExportTodos: boolean
  excelTodosPending: boolean
  onExportExcelTodos: () => void
}

export function RetidoToolbar({
  selectedCount,
  onOpenExcel,
  excelSelectionPending,
  onClearSelection,
  canExportTodos,
  excelTodosPending,
  onExportExcelTodos,
}: RetidoToolbarProps) {
  const labels = RETIDO_UI_LABELS.toolbar
  const hasSelection = selectedCount > 0

  return (
    <div className="flex flex-wrap items-center gap-3 py-2">
      <span className="text-sm text-muted-foreground">
        {labels.selected(selectedCount)}
      </span>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        disabled={!hasSelection || excelSelectionPending}
        onClick={onOpenExcel}
      >
        <ListChecks className="mr-2 size-4" />
        {labels.excel}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        disabled={!canExportTodos || excelTodosPending}
        onClick={onExportExcelTodos}
      >
        <FileSpreadsheet className="mr-2 size-4" />
        {excelTodosPending ? 'Gerando...' : labels.excelTodos}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={!hasSelection}
        onClick={onClearSelection}
      >
        <X className="mr-2 size-4" />
        {labels.clearSelection}
      </Button>
    </div>
  )
}
