'use client'

import { formatDuration } from '@/lib/masks'
import type { CreateObraMusicalFormData } from '@/schemas/create-obra-musical-schema'

type ObraMusicalRevisaoStepProps = {
  values: CreateObraMusicalFormData
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

export function ObraMusicalRevisaoStep({ values }: ObraMusicalRevisaoStepProps) {
  const totalPercentual = values.titulares.reduce((sum, t) => sum + (t.percentual ?? 0), 0)

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm font-medium text-foreground">
        Revise os dados antes de enviar à SOCINPRO.
      </p>
      <div className="space-y-3">
        <ReviewRow label="Título" value={values.titulo || '—'} />
        <ReviewRow
          label="Duração"
          value={values.duracao ? formatDuration(values.duracao) : '—'}
        />
        <ReviewRow label="Nacional" value={values.nacional ? 'Sim' : 'Não'} />
        <ReviewRow label="Instrumental" value={values.instrumental ? 'Sim' : 'Não'} />
        <ReviewRow label="Tipo de obra" value={values.derivada === 'S' ? 'Derivada' : 'Original'} />
        <ReviewRow label="Uso de IA" value={values.usoIA ? 'Sim' : 'Não'} />
        <ReviewRow
          label="Titulares"
          value={
            values.titulares.length > 0
              ? `${values.titulares.length} (${totalPercentual.toFixed(2)}%)`
              : 'Automático (titular da sessão)'
          }
        />
        <ReviewRow label="Subtítulos" value={String(values.subtitulos.length)} />
        <ReviewRow label="Referências" value={String(values.referencias.length)} />
        <ReviewRow label="Elementos IA" value={String(values.elementosIa.length)} />
        <ReviewRow
          label="Anexos"
          value={[
            values.letraFile ? 'Letra' : null,
            values.contratoFile ? 'Contrato' : null,
            values.audioFile ? 'Áudio' : null,
          ]
            .filter(Boolean)
            .join(', ') || 'Nenhum'}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Ao efetuar o cadastro, você declara que leu e aceita os Termos de Responsabilidade.
      </p>
    </div>
  )
}
