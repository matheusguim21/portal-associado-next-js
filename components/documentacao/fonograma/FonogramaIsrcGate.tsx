'use client'

import type { ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { useIsrcHabilitado } from '@/api/endpoints/documentacao/fonograma/use-isrc-habilitado'
import { cn } from '@/lib/utils'

type FonogramaIsrcGateProps = {
  children: ReactNode
  className?: string
}

export function FonogramaIsrcGate({ children, className }: FonogramaIsrcGateProps) {
  const { data, isLoading, isError } = useIsrcHabilitado()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Verificando acesso ao cadastro de fonogramas...</p>
  }

  if (isError || !data?.habilitado) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-lg border border-amber-200/80 bg-amber-50/50 px-6 py-16 text-center dark:border-amber-900/50 dark:bg-amber-950/20',
          className,
        )}
      >
        <TriangleAlert className="size-16 text-amber-500" strokeWidth={1.5} />
        <div className="space-y-2 max-w-lg">
          <p className="text-base font-semibold text-foreground">
            Acesso restrito a Produtor Fonográfico
          </p>
          <p className="text-sm text-muted-foreground">
            Para utilizar o cadastro de fonogramas, é necessário estar na categoria Produtor
            Fonográfico e ter o cadastro de ISRC habilitado. Caso seja filiado, entre em contato com
            sua representação para solicitar o acesso.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
