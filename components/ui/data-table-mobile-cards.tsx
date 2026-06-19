'use client'

import { flexRender, type ColumnDef, type Row } from '@tanstack/react-table'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getColumnHeaderLabel,
  getColumnId,
  getRowCell,
  partitionColumnsForMobile,
} from '@/components/ui/data-table-column-meta'
import { cn } from '@/lib/utils'

interface DataTableMobileCardsProps<TData> {
  rows: Row<TData>[]
  columns: ColumnDef<TData>[]
  loading?: boolean
  skeletonRowCount?: number
  emptyMessage?: string
  onCardClick: (row: Row<TData>) => void
}

function stopCardClickPropagation(event: React.MouseEvent) {
  event.stopPropagation()
}

export function DataTableMobileCards<TData>({
  rows,
  columns,
  loading = false,
  skeletonRowCount = 5,
  emptyMessage = 'Nenhum registro encontrado.',
  onCardClick,
}: DataTableMobileCardsProps<TData>) {
  const { primary, summary, actions } = partitionColumnsForMobile(columns)

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonRowCount }).map((_, index) => (
          <Card key={`mobile-card-skeleton-${index}`} className="ring-1 ring-foreground/10">
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground shadow-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const hasActions = actions.length > 0

        return (
          <Card
            key={row.id}
            role="button"
            tabIndex={0}
            className={cn(
              'cursor-pointer ring-1 ring-foreground/10 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
            onClick={() => onCardClick(row)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onCardClick(row)
              }
            }}
          >
            <CardHeader className="pb-0">
              {primary ? (
                <CardTitle className="line-clamp-2 text-base">
                  {(() => {
                    const cell = getRowCell(row, primary)
                    return cell
                      ? flexRender(cell.column.columnDef.cell, cell.getContext())
                      : '—'
                  })()}
                </CardTitle>
              ) : (
                <CardTitle className="text-base text-muted-foreground">Registro</CardTitle>
              )}
              <CardAction>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Ver detalhes"
                  onClick={(event) => {
                    stopCardClickPropagation(event)
                    onCardClick(row)
                  }}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </CardAction>
            </CardHeader>

            {summary.length > 0 && (
              <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3">
                {summary.map((column) => {
                  const columnId = getColumnId(column)
                  if (!columnId) return null

                  const cell = getRowCell(row, column)

                  return (
                    <div key={columnId} className="min-w-0 space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground">
                        {getColumnHeaderLabel(column)}
                      </p>
                      <div className="text-sm break-words">
                        {cell
                          ? flexRender(cell.column.columnDef.cell, cell.getContext())
                          : '—'}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            )}

            {(hasActions || summary.length === 0) && (
              <CardFooter
                className={cn(
                  'mt-3 flex items-center justify-between gap-2 border-t bg-muted/30',
                  !hasActions && 'justify-end',
                )}
                onClick={stopCardClickPropagation}
              >
                {hasActions ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {actions.map((column) => {
                      const columnId = getColumnId(column)
                      if (!columnId) return null

                      const cell = getRowCell(row, column)

                      return (
                        <div key={columnId}>
                          {cell
                            ? flexRender(cell.column.columnDef.cell, cell.getContext())
                            : null}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Toque para ver detalhes</span>
                )}
                {!hasActions && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Ver detalhes"
                    onClick={(event) => {
                      stopCardClickPropagation(event)
                      onCardClick(row)
                    }}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>
        )
      })}
    </div>
  )
}
