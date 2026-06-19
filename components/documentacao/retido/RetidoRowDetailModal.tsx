'use client'

import { useMemo } from 'react'
import type {
  RetAutModel,
  RetConModel,
  RetidoTab,
  RetTitModel,
} from '@/types/api/documentacao/retido'
import { RETIDO_UI_LABELS } from '@/lib/retido-labels'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RetidoDetailTable } from '@/components/documentacao/retido/RetidoDetailTable'
import { buildRetidoDetailRows } from '@/components/documentacao/retido/retido-detail-rows'

interface RetidoRowDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tab: RetidoTab
  row: RetAutModel | RetConModel | RetTitModel | null
}

export function RetidoRowDetailModal({
  open,
  onOpenChange,
  tab,
  row,
}: RetidoRowDetailModalProps) {
  const detailRows = useMemo(
    () => (row ? buildRetidoDetailRows(row, tab) : []),
    [row, tab],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="wide" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{RETIDO_UI_LABELS.detailModal.title}</DialogTitle>
        </DialogHeader>
        {row && <RetidoDetailTable rows={detailRows} />}
      </DialogContent>
    </Dialog>
  )
}
