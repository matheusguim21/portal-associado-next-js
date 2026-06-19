'use client'

import { useMemo, useState } from 'react'
import { Layers } from 'lucide-react'
import {
  createPoutPourritSelectColumn,
  poutPourritSearchModalColumns,
} from '@/components/documentacao/pout-pourrit/pout-pourrit-columns'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { TableFiltersCard, TableFiltersLabel } from '@/components/ui/table-filters'
import { usePaginatedPoutPourrit } from '@/api/endpoints/documentacao/use-documentacao-queries'
import type { PoutPourritApi } from '@/types/api/documentacao'

type PoutPourritSearchModalProps = {
  onSelect: (pout: PoutPourritApi) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}

export function PoutPourritSearchModal({
  onSelect,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  hideTrigger = false,
}: PoutPourritSearchModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const [titulo, setTitulo] = useState('')
  const [results, setResults] = useState<PoutPourritApi[]>([])
  const { mutate: pesquisar, isPending } = usePaginatedPoutPourrit()

  function handleSearch() {
    pesquisar(
      { titulo: titulo || undefined, page: 0, size: 20 },
      { onSuccess: (data) => setResults(data.content ?? []) },
    )
  }

  const columns = useMemo(
    () => [
      ...poutPourritSearchModalColumns,
      createPoutPourritSelectColumn(onSelect, () => setOpen(false)),
    ],
    [onSelect, setOpen],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger
          render={
            <Button type="button" variant="outline" size="sm">
              <Layers className="size-4" />
              Buscar pout pourrit
            </Button>
          }
        />
      )}
      <DialogContent size="wide">
        <DialogHeader>
          <DialogTitle>Pesquisar pout pourrit</DialogTitle>
        </DialogHeader>

        <TableFiltersCard>
          <div className="flex flex-col gap-1.5 flex-1">
            <TableFiltersLabel>Título</TableFiltersLabel>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <Button type="button" onClick={handleSearch} disabled={isPending}>
            Pesquisar
          </Button>
        </TableFiltersCard>

        <DataTable columns={columns} data={results} loading={isPending} compact />
      </DialogContent>
    </Dialog>
  )
}
