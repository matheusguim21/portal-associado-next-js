'use client'

import { FonogramaCadastroForm } from '@/components/documentacao/fonograma/FonogramaCadastroForm'
import { FonogramaIsrcGate } from '@/components/documentacao/fonograma/FonogramaIsrcGate'
import { PageHeader } from '@/components/page-header'

export function NovaFonogramaPageContent() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nova fonograma"
        description="Cadastre um novo fonograma na SOCINPRO."
      />
      <FonogramaIsrcGate>
        <FonogramaCadastroForm />
      </FonogramaIsrcGate>
    </div>
  )
}
