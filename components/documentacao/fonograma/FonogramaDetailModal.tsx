'use client'

import { useGetFonograma } from '@/api/endpoints/documentacao/fonograma/use-get-fonograma'
import { FonogramaDetalheTabs } from '@/components/documentacao/fonograma/FonogramaDetalheTabs'
import { getFonogramaTitulo } from '@/components/documentacao/fonograma/fonograma-columns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type FonogramaDetailModalProps = {
  fonogramaId: number | null
  onOpenChange: (open: boolean) => void
}

export function FonogramaDetailModal({ fonogramaId, onOpenChange }: FonogramaDetailModalProps) {
  const { data: fonograma, isPending, isError, errorMessage } = useGetFonograma(
    fonogramaId ?? undefined,
  )

  const titulo = fonograma
    ? getFonogramaTitulo(fonograma)
    : fonogramaId
      ? `Fonograma #${fonogramaId}`
      : 'Fonograma'

  return (
    <Dialog open={fonogramaId !== null} onOpenChange={onOpenChange}>
      <DialogContent size="wide" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {titulo}
            {fonograma && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                Cód. SOC {fonograma.id}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isPending && (
          <p className="text-sm text-muted-foreground">Carregando fonograma...</p>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            {errorMessage ?? 'Não foi possível carregar os detalhes do fonograma.'}
          </p>
        )}

        {fonograma && !isPending && <FonogramaDetalheTabs fonograma={fonograma} />}
      </DialogContent>
    </Dialog>
  )
}
