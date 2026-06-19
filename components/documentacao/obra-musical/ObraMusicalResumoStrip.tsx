'use client'

import type { CreateObraMusicalFormData } from '@/schemas/create-obra-musical-schema'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ObraMusicalResumoStripProps = {
  values: Pick<CreateObraMusicalFormData, 'titulo' | 'derivada' | 'nacional'>
}

export function ObraMusicalResumoStrip({ values }: ObraMusicalResumoStripProps) {
  return (
    <Card className="border-dashed bg-muted/20">
      <CardContent className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Título</Label>
          <Input value={values.titulo || '—'} readOnly className="bg-muted/50" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Tipo de obra</Label>
          <Input
            value={values.derivada === 'S' ? 'Derivada' : 'Original'}
            readOnly
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Nacional</Label>
          <Input value={values.nacional ? 'Sim' : 'Não'} readOnly className="bg-muted/50" />
        </div>
      </CardContent>
    </Card>
  )
}
