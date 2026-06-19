'use client'

import { useMemo, useState } from 'react'
import { Music } from 'lucide-react'
import { ObraMusicalSearchForm } from '@/components/documentacao/obra-musical/ObraMusicalSearchForm'
import {
  createObraMusicalSelectColumn,
  obraMusicalSearchModalColumns,
} from '@/components/documentacao/obra-musical/obra-musical-columns'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { usePaginatedObrasMusicais } from '@/api/endpoints/documentacao/obra-musical/use-paginated-obras-musicais'
import { obraFormToApiParams } from '@/lib/search/to-api-params'
import type { ObraMusicalApi } from '@/types/api/documentacao'
import type { SearchObraMusicalFormData } from '@/schemas/search-obra-musical-schema'

type ObraMusicalSearchModalProps = {
  onSelect: (obra: ObraMusicalApi) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}

export function ObraMusicalSearchModal({
  onSelect,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  hideTrigger = false,
}: ObraMusicalSearchModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const [results, setResults] = useState<ObraMusicalApi[]>([])
  const { mutate: pesquisar, isPending } = usePaginatedObrasMusicais()

  function handleSearch(data: SearchObraMusicalFormData) {
    const params = obraFormToApiParams(data, { page: 0, size: 20 })
    pesquisar(params, {
      onSuccess: (response) => setResults(response.content ?? []),
    })
  }

  const columns = useMemo(
    () => [
      ...obraMusicalSearchModalColumns,
      createObraMusicalSelectColumn((obra) => {
        onSelect(obra)
        setOpen(false)
      }),
    ],
    [onSelect, setOpen],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger
          render={
            <Button type="button" variant="outline" size="sm">
              <Music className="size-4" />
              Buscar obra
            </Button>
          }
        />
      )}
      <DialogContent size="wide" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pesquisar obra musical</DialogTitle>
        </DialogHeader>

        <ObraMusicalSearchForm
          mode="consulta"
          onSubmit={handleSearch}
          onClear={() => setResults([])}
          isPending={isPending}
        />

        <DataTable columns={columns} data={results} loading={isPending} compact />
      </DialogContent>
    </Dialog>
  )
}
