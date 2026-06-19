'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { ObraMusicalDetalheTabs } from '@/components/documentacao/obra-musical/ObraMusicalDetalheTabs'
import { ObraMusicalGerarOcorrenciaButton } from '@/components/documentacao/obra-musical/ObraMusicalGerarOcorrenciaButton'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useGetObraMusical } from '@/api/endpoints/documentacao/obra-musical/use-get-obra-musical'
import { getSituacaoCadastralBadgeClass } from '@/lib/badge-colors'
import {
  getArquivoRepertorioStatusLabel,
  getSituacaoCadastralKey,
  getSituacaoCadastralLabel,
} from '@/lib/enum-labels'

export default function ObraMusicaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const obraId = Number(id)
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: obra, isPending, isError, refetch } = useGetObraMusical(obraId)
  const podeEditar = obra?.status === 'CAD_TITULAR'

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" render={<Link href="/obras/cadastro" />}>
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Voltar
      </Button>

      {isPending && !obra ? (
        <p className="text-sm text-muted-foreground">Carregando obra...</p>
      ) : isError || !obra || Number.isNaN(obraId) ? (
        <EmptyState title="Obra não encontrada" />
      ) : (
        <>
          <PageHeader
            title={obra.titulo}
            description={`Código SOC ${obra.id}`}
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  label={getSituacaoCadastralLabel(obra.situacaoCadastral)}
                  colorKey={getSituacaoCadastralKey(obra.situacaoCadastral)}
                  getColorClass={getSituacaoCadastralBadgeClass}
                />
                {obra.status ? (
                  <StatusBadge
                    label={getArquivoRepertorioStatusLabel(obra.status)}
                    colorKey={obra.status}
                    getColorClass={() => 'bg-muted text-muted-foreground'}
                  />
                ) : null}
                {podeEditar ? (
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/obras/cadastro/${obra.id}/editar`} />}
                  >
                    <Pencil className="size-4" data-icon="inline-start" />
                    Editar
                  </Button>
                ) : null}
                <ObraMusicalGerarOcorrenciaButton
                  key={refreshKey}
                  obra={obra}
                  onSuccess={() => {
                    setRefreshKey((value) => value + 1)
                    refetch()
                  }}
                />
              </div>
            }
          />
          <ObraMusicalDetalheTabs obra={obra} />
        </>
      )}
    </div>
  )
}
