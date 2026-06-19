'use client'

import { RETIDO_UI_LABELS } from '@/lib/retido-labels'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface GenerateRetidoExcelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pkCodigos: string[]
  isPending: boolean
  onConfirm: () => void
}

export function GenerateRetidoExcelModal({
  open,
  onOpenChange,
  pkCodigos,
  isPending,
  onConfirm,
}: GenerateRetidoExcelModalProps) {
  const labels = RETIDO_UI_LABELS.excelModal

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {labels.description(pkCodigos.length)}
        </p>
        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {labels.cancel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending || pkCodigos.length === 0}
          >
            {isPending ? labels.generating : labels.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
