import { cn } from '@/lib/utils'

function repertorioStatCardClass() {
  return cn('flex justify-between rounded-md border bg-background px-3 text-sm items-center py-2')
}

interface RepertorioSummaryProps {
  totalObras: number
  totalFonogramas: number
  totalObrasCadastradas: number
  totalFonogramasCadastrados: number
}

export function RepertorioSummary({
  totalObras,
  totalFonogramas,
  totalObrasCadastradas,
  totalFonogramasCadastrados,
}: RepertorioSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-muted/30 p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
          Repertório
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className={repertorioStatCardClass()}>
            <span>Obras</span>
            <span className="font-semibold tabular-nums">{totalObras.toLocaleString('pt-BR')}</span>
          </div>
          <div className={repertorioStatCardClass()}>
            <span>Fonogramas</span>
            <span className="font-semibold tabular-nums">
              {totalFonogramas.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-muted/30 p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
          Cadastrado no período
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className={repertorioStatCardClass()}>
            <span>Obras cadastradas</span>
            <span className="font-semibold tabular-nums">
              {totalObrasCadastradas.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className={repertorioStatCardClass()}>
            <span>Fonogramas cadastrados</span>
            <span className="font-semibold tabular-nums">
              {totalFonogramasCadastrados.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
