'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useMeusFonogramas } from '@/api/endpoints/documentacao/fonograma/use-paginated-fonogramas'
import { FonogramaDetalheTabs } from '@/components/documentacao/fonograma/FonogramaDetalheTabs'
import { FonogramaIsrcGate } from '@/components/documentacao/fonograma/FonogramaIsrcGate'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { useTitularId } from '@/hooks/use-auth'
import { getSituacaoCadastralBadgeClass } from '@/lib/badge-colors'
import { getSituacaoCadastralKey, getSituacaoCadastralLabel } from '@/lib/enum-labels'
import type { FonogramaApi } from '@/types/api/documentacao'

export default function FonogramaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const titularId = useTitularId()
  const [fonograma, setFonograma] = useState<FonogramaApi | null>(null)
  const { mutate: pesquisar, isPending } = useMeusFonogramas()

  useEffect(() => {
    if (!titularId) return

    pesquisar(
      {
        id: Number(id),
        titularId,
        tipoObmPop: 'OBRA_MUSICAL',
        page: 0,
        size: 1,
      },
      { onSuccess: (data) => setFonograma(data.content?.[0] ?? null) },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, titularId])

  const titulo =
    fonograma?.obraMusical?.titulo ??
    fonograma?.poutPourrit?.titulo ??
    fonograma?.titulo ??
    `Fonograma #${id}`

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" render={<Link href="/fonogramas/cadastro" />}>
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Voltar
      </Button>

      <FonogramaIsrcGate>
        {isPending && !fonograma ? (
          <p className="text-sm text-muted-foreground">Carregando fonograma...</p>
        ) : !fonograma ? (
          <EmptyState title="Fonograma não encontrado" />
        ) : (
          <>
            <PageHeader
              title={titulo}
              description={`Código SOC ${fonograma.id}`}
              actions={
                <StatusBadge
                  label={getSituacaoCadastralLabel(fonograma.situacaoCadastral)}
                  colorKey={getSituacaoCadastralKey(fonograma.situacaoCadastral)}
                  getColorClass={getSituacaoCadastralBadgeClass}
                />
              }
            />
            <FonogramaDetalheTabs fonograma={fonograma} />
          </>
        )}
      </FonogramaIsrcGate>
    </div>
  )
}
