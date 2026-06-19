'use client'

import { EmptyState } from '@/components/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatIsrc } from '@/lib/masks'
import {
  getArquivoRepertorioStatusLabel,
  getNacionalLabel,
  getSituacaoCadastralLabel,
} from '@/lib/enum-labels'
import type { FonogramaApi } from '@/types/api/documentacao'

type FonogramaDetalheTabsProps = {
  fonograma: FonogramaApi
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Input value={value} readOnly className="bg-muted/50" />
    </div>
  )
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <EmptyState
      title={`${title} em desenvolvimento`}
      description="Esta seção será disponibilizada em uma próxima etapa da integração."
    />
  )
}

export function FonogramaDetalheTabs({ fonograma }: FonogramaDetalheTabsProps) {
  const obraTitulo =
    fonograma.obraMusical?.titulo ?? fonograma.poutPourrit?.titulo ?? fonograma.titulo ?? '—'

  return (
    <Tabs defaultValue="fonograma" className="space-y-4">
      <TabsList variant="line" className="w-full justify-start">
        <TabsTrigger value="fonograma">Fonograma</TabsTrigger>
        <TabsTrigger value="titulares">Titulares</TabsTrigger>
        <TabsTrigger value="ia">IA</TabsTrigger>
      </TabsList>

      <TabsContent value="fonograma">
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <ReadOnlyField label="Código SOC" value={String(fonograma.id)} />
            <ReadOnlyField
              label="Código ECAD"
              value={fonograma.codigoEcad ? String(fonograma.codigoEcad) : ''}
            />
            <ReadOnlyField
              label="ISRC"
              value={fonograma.isrc ? formatIsrc(fonograma.isrc) : ''}
            />
            <ReadOnlyField label="GRA" value={fonograma.gra ?? ''} />
            <ReadOnlyField label="Obra vinculada" value={obraTitulo} />
            <ReadOnlyField
              label="Situação cadastral"
              value={getSituacaoCadastralLabel(fonograma.situacaoCadastral)}
            />
            <ReadOnlyField label="Nacional" value={getNacionalLabel(fonograma.nacional)} />
            <ReadOnlyField label="País" value={fonograma.pais?.nome ?? fonograma.pais?.sigla ?? '—'} />
            <ReadOnlyField label="Data de emissão" value={fonograma.dtEmissao ?? '—'} />
            <ReadOnlyField label="Data de lançamento" value={fonograma.dtLancamento ?? '—'} />
            <ReadOnlyField label="Gravação original" value={fonograma.dtGravacaoOriginal ?? '—'} />
            <ReadOnlyField label="Status" value={getArquivoRepertorioStatusLabel(fonograma.status)} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="titulares">
        <Card>
          <CardContent className="pt-6">
            <PlaceholderTab title="Titulares" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ia">
        <Card>
          <CardContent className="pt-6">
            <PlaceholderTab title="IA" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
