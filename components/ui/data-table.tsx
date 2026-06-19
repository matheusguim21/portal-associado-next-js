'use client'

import { useState } from 'react'
import {
  flexRender,
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  type Row,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableMobileCards } from '@/components/ui/data-table-mobile-cards'
import { DataTableRowDetailDialog } from '@/components/ui/data-table-row-detail-dialog'
import type { DataTableColumnMeta } from '@/components/ui/data-table-column-meta'
import { cn } from '@/lib/utils'

export type { DataTableColumnMeta }

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  loading?: boolean
  skeletonRowCount?: number
  emptyMessage?: string
  meta?: Record<string, unknown>
  compact?: boolean
  containerClassName?: string
  mobileCards?: boolean
  onRowClick?: (row: TData) => void
}

export function DataTable<TData>({
  columns,
  data,
  loading = false,
  skeletonRowCount = 5,
  emptyMessage = 'Nenhum registro encontrado.',
  meta,
  compact = false,
  containerClassName,
  mobileCards = true,
  onRowClick,
}: DataTableProps<TData>) {
  const [selectedRow, setSelectedRow] = useState<Row<TData> | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
  })

  const headCellClass = compact ? 'h-10 px-2 sm:px-3 text-xs sm:text-sm' : 'h-12 px-4'
  const bodyCellClass = compact ? 'px-2 py-2 text-xs sm:text-sm sm:px-3 align-top' : 'px-4 py-3'
  const rows = table.getRowModel().rows

  function handleCardClick(row: Row<TData>) {
    if (onRowClick) {
      onRowClick(row.original)
      return
    }

    setSelectedRow(row)
  }

  return (
    <>
      <div
        className={cn(
          'w-full min-w-0 max-w-full',
          mobileCards ? 'hidden md:block overflow-x-auto overscroll-x-contain' : 'overflow-x-auto overscroll-x-contain',
          containerClassName,
        )}
      >
        <div className="rounded-lg border border-border bg-card shadow-sm min-w-0">
          <Table className={cn(compact && 'table-fixed w-full min-w-2xl md:min-w-0')}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  {headerGroup.headers.map((header) => {
                    const columnMeta = header.column.columnDef.meta as DataTableColumnMeta | undefined
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          'text-left align-middle font-semibold text-muted-foreground bg-muted/30',
                          compact ? 'whitespace-normal' : 'whitespace-nowrap',
                          headCellClass,
                          columnMeta?.className,
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      {columns.map((_, colIndex) => (
                        <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`} className={bodyCellClass}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : rows?.length
                  ? rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(
                          'border-b border-border last:border-0 hover:bg-muted/50 transition-colors',
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                        )}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const columnMeta = cell.column.columnDef.meta as DataTableColumnMeta | undefined
                          return (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                compact ? 'align-top whitespace-normal' : 'align-middle whitespace-nowrap',
                                bodyCellClass,
                                columnMeta?.className,
                              )}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))
                  : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center text-muted-foreground"
                        >
                          {emptyMessage}
                        </TableCell>
                      </TableRow>
                    )}
            </TableBody>
          </Table>
        </div>
      </div>

      {mobileCards && (
        <div className={cn('md:hidden', containerClassName)}>
          <DataTableMobileCards
            rows={rows}
            columns={columns}
            loading={loading}
            skeletonRowCount={skeletonRowCount}
            emptyMessage={emptyMessage}
            onCardClick={handleCardClick}
          />
        </div>
      )}

      {mobileCards && !onRowClick && (
        <DataTableRowDetailDialog
          open={selectedRow !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedRow(null)
          }}
          row={selectedRow}
          columns={columns}
        />
      )}
    </>
  )
}
