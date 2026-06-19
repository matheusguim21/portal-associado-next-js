'use client'

import { useState } from 'react'
import { FileCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useGerarOcorrenciaObraMusical } from '@/api/endpoints/documentacao/obra-musical/use-gerar-ocorrencia-obra-musical'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ObraMusicalApi } from '@/types/api/documentacao'

type ObraMusicalGerarOcorrenciaButtonProps = {
  obra: ObraMusicalApi
  onSuccess?: () => void
  display?: 'default' | 'icon'
  size?: 'sm' | 'default'
  variant?: 'outline' | 'ghost' | 'default'
}

export function ObraMusicalGerarOcorrenciaButton({
  obra,
  onSuccess,
  display = 'default',
  size = 'sm',
  variant = 'outline',
}: ObraMusicalGerarOcorrenciaButtonProps) {
  const [open, setOpen] = useState(false)
  const { mutate: gerarOcorrencia, isPending } = useGerarOcorrenciaObraMusical()

  if (obra.status !== 'CAD_TITULAR') {
    return null
  }

  function handleConfirm() {
    gerarOcorrencia(obra.id, {
      onSuccess: () => {
        toast.success('Ocorrência gerada com sucesso.')
        setOpen(false)
        onSuccess?.()
      },
    })
  }

  const triggerButton =
    display === 'icon' ? (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              size="icon"
              disabled={isPending}
              loading={isPending}
              onClick={() => setOpen(true)}
            >
              <FileCheck />
            </Button>
          }
        />
        <TooltipContent>Gerar ocorrência</TooltipContent>
      </Tooltip>
    ) : (
      <Button variant={variant} size={size} disabled={isPending} onClick={() => setOpen(true)}>
        <FileCheck className="size-4" data-icon="inline-start" />
        Gerar ocorrência
      </Button>
    )

  return (
    <>
      {triggerButton}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gerar ocorrência</AlertDialogTitle>
            <AlertDialogDescription>
              Confirma a geração da ocorrência para a obra &quot;{obra.titulo}&quot;? Após essa
              ação, a obra não poderá mais ser editada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isPending ? 'Gerando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
