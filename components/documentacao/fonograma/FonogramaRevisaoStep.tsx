'use client'

import { tipoObmPopOptions } from '@/lib/search/filter-options'
import { formatDuration, formatIsrc } from '@/lib/masks'
import type { CreateFonogramaFormData } from '@/schemas/create-fonograma-schema'

type FonogramaRevisaoStepProps = {
  values: CreateFonogramaFormData
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

export function FonogramaRevisaoStep({ values }: FonogramaRevisaoStepProps) {
  const tipoLabel =
    tipoObmPopOptions.find((o) => o.value === values.tipoObmPop)?.label ?? values.tipoObmPop

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm font-medium text-foreground">
        Revise os dados antes de enviar à SOCINPRO.
      </p>
      <div className="space-y-3">
        <ReviewRow label="Tipo" value={tipoLabel} />
        <ReviewRow label="Obra vinculada" value={values.obraTitulo || '—'} />
        <ReviewRow
          label="Cód. SOC da obra"
          value={values.codigoSocObraPoutPourrit ? String(values.codigoSocObraPoutPourrit) : '—'}
        />
        <ReviewRow
          label="ISRC"
          value={values.isrc ? formatIsrc(values.isrc) : '—'}
        />
        <ReviewRow label="GRA" value={values.gra || '—'} />
        <ReviewRow
          label="Duração"
          value={values.duracao ? formatDuration(values.duracao) : '—'}
        />
        <ReviewRow label="Nacional" value={values.nacional ? 'Sim' : 'Não'} />
        <ReviewRow label="Instrumental" value={values.instrumental ? 'Sim' : 'Não'} />
      </div>
    </div>
  )
}
