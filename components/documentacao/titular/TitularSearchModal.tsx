'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, UserSearch } from 'lucide-react'
import { usePaginatedTitularesIntegracao } from '@/api/endpoints/documentacao/titular/use-paginated-titulares-integracao'
import {
  createTitularSelectColumn,
  titularSearchColumns,
} from '@/components/documentacao/titular/titular-columns'
import { TitularSearchForm } from '@/components/documentacao/titular/TitularSearchForm'
import { SearchResultsToolbar } from '@/components/search-results-toolbar'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { titularFormToApiParams } from '@/lib/search/to-api-params'
import type { SearchTitularFormData } from '@/schemas/search-titular-schema'
import type { TitularApi, TitularFiltro } from '@/types/api/documentacao'

type TitularSearchModalProps = {
  onSelect: (titular: TitularApi) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
  compact?: boolean
}

export function TitularSearchModal({
  onSelect,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  hideTrigger = false,
  compact = false,
}: TitularSearchModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const [query, setQuery] = useState<TitularFiltro>({
    page: 0,
    size: 10,
  })

  const { mutate, isPending, data, reset } = usePaginatedTitularesIntegracao()

  const handleSubmit = useCallback((form: SearchTitularFormData) => {
    setQuery((prev) => ({
      ...titularFormToApiParams(form, { page: 0, size: prev.size ?? 10 }),
    }))
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setQuery((prev) => ({ ...prev, page: newPage }))
  }, [])

  const handleSizeChange = useCallback((newSize: number) => {
    setQuery((prev) => ({ ...prev, size: newSize, page: 0 }))
  }, [])

  const handleSelect = useCallback(
    (titular: TitularApi) => {
      onSelect(titular)
      setOpen(false)
      reset()
    },
    [onSelect, reset, setOpen],
  )

  const tableColumns = useMemo(
    () => [
      ...titularSearchColumns,
      createTitularSelectColumn(handleSelect),
    ],
    [handleSelect],
  )

  useEffect(() => {
    if (!query.pesquisa) return
    const { page = 0, size = 10, sort, ...filters } = query
    mutate({
      ...filters,
      pesquisa: query.pesquisa,
      page,
      size,
      ...(sort ? { sort } : {}),
    })
  }, [query, mutate])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger
          render={
            <Button
              type="button"
              size={compact ? 'lg' : 'sm'}
            >
              {!compact && (
                <>
                  <Search className="size-4" />
                  Buscar titular
                </>
              )}
              {compact && <UserSearch className="size-4" />}
            </Button>
          }
        />
      )}
      <DialogContent size="wide" className="max-h-[90vh] overflow-y-auto dark:bg-neutral-700">
        <DialogHeader>
          <DialogTitle>Pesquisar titular</DialogTitle>
        </DialogHeader>

        <TitularSearchForm onSubmit={handleSubmit} isPending={isPending} />

        <div className="space-y-4 overflow-hidden">
          <DataTable
            columns={tableColumns}
            data={data?.content ?? []}
            loading={isPending}
            compact
          />

          {data && data.totalElements > 0 && (
            <SearchResultsToolbar
              page={data.number}
              size={data.size}
              totalElements={data.totalElements}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
              onSizeChange={handleSizeChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
