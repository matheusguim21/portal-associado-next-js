'use client'

import { ObraMusicalCadastroForm } from '@/components/documentacao/obra-musical/ObraMusicalCadastroForm'
import type { CreateObraMusicalFormData } from '@/schemas/create-obra-musical-schema'

type EditarObraMusicaPageContentProps = {
  obraId: number
  initialFormData?: CreateObraMusicalFormData
}

export function EditarObraMusicaPageContent({
  obraId,
  initialFormData,
}: EditarObraMusicaPageContentProps) {
  if (Number.isNaN(obraId)) {
    return <p className="text-sm text-muted-foreground">Obra inválida.</p>
  }

  return <ObraMusicalCadastroForm obraId={obraId} initialFormData={initialFormData} />
}
