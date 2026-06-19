'use client'

import { useGetObraMusical } from '@/api/endpoints/documentacao/obra-musical/use-get-obra-musical'
import { ObraMusicalDetalheTabs } from '@/components/documentacao/obra-musical/ObraMusicalDetalheTabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ObraMusicalDetailModalProps = {
  obraId: number | null
  onOpenChange: (open: boolean) => void
}

export function ObraMusicalDetailModal({ obraId, onOpenChange }: ObraMusicalDetailModalProps) {
  const { data: obra, isPending, isError, errorMessage } = useGetObraMusical(obraId ?? undefined)

  const titulo = obra?.titulo ?? (obraId ? `Obra #${obraId}` : 'Obra musical')

  return (
    <Dialog open={obraId !== null} onOpenChange={onOpenChange}>
      <DialogContent size="wide" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {titulo}
            {obra && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                Cód. SOC {obra.id}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isPending && (
          <p className="text-sm text-muted-foreground">Carregando obra musical...</p>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            {errorMessage ?? 'Não foi possível carregar os detalhes da obra musical.'}
          </p>
        )}

        {obra && !isPending && <ObraMusicalDetalheTabs obra={obra} />}
      </DialogContent>
    </Dialog>
  )
}
