'use client'

import { EmptyState } from '@/components/empty-state'
import { ObraMusicalTitularesTable } from '@/components/documentacao/obra-musical/ObraMusicalTitularesTable'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getDerivadaLabel,
  getNacionalLabel,
  getSituacaoCadastralLabel,
} from '@/lib/enum-labels'
import type { ObraMusicalApi } from '@/types/api/documentacao'

type ObraMusicalDetalheTabsProps = {
  obra: ObraMusicalApi
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

function getSimNaoLabel(value?: string | null): string {
  if (value === 'S') return 'Sim'
  if (value === 'N') return 'Não'
  return '—'
}

function getTpUsoIALabel(value?: 'T' | 'P' | null): string {
  if (value === 'T') return 'Total'
  if (value === 'P') return 'Parcial'
  return '—'
}

function formatObraOriginal(obra?: ObraMusicalApi['obraMusicalOriginal']): string {
  if (!obra) return '—'
  const parts = [obra.titulo, obra.id != null ? `SOC ${obra.id}` : null, obra.codigoEcad != null ? `ECAD ${obra.codigoEcad}` : null]
  return parts.filter(Boolean).join(' · ') || '—'
}

export function ObraMusicalDetalheTabs({ obra }: ObraMusicalDetalheTabsProps) {
  return (
    <Tabs defaultValue="obra" className="space-y-4">
      <TabsList variant="line" className="w-full justify-start">
        <TabsTrigger value="obra">Obra Musical</TabsTrigger>
        <TabsTrigger value="titulares">Titulares</TabsTrigger>
        <TabsTrigger value="subtitulo">Subtítulo</TabsTrigger>
        <TabsTrigger value="referencia">Referência</TabsTrigger>
        <TabsTrigger value="ia">IA</TabsTrigger>
      </TabsList>

      <TabsContent value="obra">
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <ReadOnlyField label="Código SOC" value={String(obra.id)} />
            <ReadOnlyField
              label="Código ECAD"
              value={obra.codigoEcad ? String(obra.codigoEcad) : ''}
            />
            <ReadOnlyField label="ISWC" value={obra.iswc ?? ''} />
            <ReadOnlyField label="Título" value={obra.titulo} />
            <ReadOnlyField
              label="Situação cadastral"
              value={getSituacaoCadastralLabel(obra.situacaoCadastral)}
            />
            <ReadOnlyField label="Nacional" value={getNacionalLabel(obra.nacional)} />
            <ReadOnlyField label="Derivada" value={getDerivadaLabel(obra.derivada)} />
            <ReadOnlyField label="Instrumental" value={getSimNaoLabel(obra.instrumental)} />
            <ReadOnlyField label="Composta" value={getSimNaoLabel(obra.composta)} />
            <ReadOnlyField
              label="Tipo obra composta"
              value={obra.tipoObraComposta?.descricao ?? obra.tipoObraComposta?.tipo ?? '—'}
            />
            <ReadOnlyField
              label="Gênero musical"
              value={obra.generoMusical?.descricao ?? obra.generoMusical?.codigo ?? '—'}
            />
            <ReadOnlyField
              label="Idioma"
              value={obra.idioma?.idioma ?? obra.idioma?.sigla ?? '—'}
            />
            <ReadOnlyField label="Duração" value={obra.duracao ?? '—'} />
            <ReadOnlyField label="Data de criação" value={obra.dtCriacao ?? '—'} />
            <ReadOnlyField label="Data de registro" value={obra.dtRegistro ?? '—'} />
            {obra.derivada === 'S' ? (
              <ReadOnlyField
                label="Obra original"
                value={formatObraOriginal(obra.obraMusicalOriginal)}
              />
            ) : null}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="titulares">
        <Card>
          <CardContent className="pt-6">
            <ObraMusicalTitularesTable titulares={obra.obraMusicalTitular} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subtitulo">
        <Card>
          <CardContent className="pt-6">
            <PlaceholderTab title="Subtítulo" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="referencia">
        <Card>
          <CardContent className="pt-6">
            <PlaceholderTab title="Referência" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ia">
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <ReadOnlyField label="Uso de IA" value={getSimNaoLabel(obra.usoIA)} />
            <ReadOnlyField label="Tipo de uso de IA" value={getTpUsoIALabel(obra.tpUsoIA)} />
            <ReadOnlyField label="Link do áudio" value={obra.linkAudio ?? '—'} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
