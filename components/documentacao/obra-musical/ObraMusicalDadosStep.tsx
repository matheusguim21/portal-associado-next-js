'use client'

import { useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Upload } from 'lucide-react'
import {
  useGenerosMusicais,
  useIdiomas,
  useTiposObraComposta,
} from '@/api/endpoints/documentacao/diversos/use-diversos-queries'
import { ObraMusicalSearchModal } from '@/components/documentacao/obra-musical/ObraMusicalSearchModal'
import { SimNaoRadio } from '@/components/documentacao/obra-musical/SimNaoRadio'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import { RadioGroup, RadioGroupItem, RadioGroupLabel } from '@/components/ui/radio-group'
import { SelectField } from '@/components/ui/select-field'
import type { CreateObraMusicalFormData } from '@/schemas/create-obra-musical-schema'

type ObraMusicalDadosStepProps = {
  form: UseFormReturn<CreateObraMusicalFormData>
}

const FILE_FIELDS = [
  { key: 'letraFile' as const, label: 'Letra Musical', hint: 'PDF, TXT ou DOCX — máx. 4MB' },
  { key: 'contratoFile' as const, label: 'Contrato Musical', hint: 'PDF ou TXT — máx. 10MB' },
  { key: 'audioFile' as const, label: 'Áudio', hint: 'MP3 ou WAV — máx. 50MB' },
]

export function ObraMusicalDadosStep({ form }: ObraMusicalDadosStepProps) {
  const { data: generos } = useGenerosMusicais()
  const { data: idiomas } = useIdiomas()
  const { data: tiposObraComposta } = useTiposObraComposta()
  const derivada = form.watch('derivada')
  const composta = form.watch('composta')

  const generoOptions = useMemo(
    () => (generos ?? []).map((g) => ({ value: g.codigo ?? '', label: g.descricao ?? g.codigo ?? '' })),
    [generos],
  )
  const idiomaOptions = useMemo(
    () => (idiomas ?? []).map((i) => ({ value: i.sigla ?? '', label: i.idioma ?? i.sigla ?? '' })),
    [idiomas],
  )
  const tipoObraCompostaOptions = useMemo(
    () =>
      (tiposObraComposta ?? []).map((t) => ({
        value: t.tipo ?? '',
        label: t.descricao ?? t.tipo ?? '',
      })),
    [tiposObraComposta],
  )

  return (
    <Form {...form}>
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Identificação</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>
                    Título <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="NOME DA OBRA"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (mm:ss:ff)</FormLabel>
                  <FormControl>
                    <MaskedInput
                      mask="duration"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      placeholder="Ex: 03:45:00"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dtCriacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de criação</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nacional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nacional</FormLabel>
                  <SimNaoRadio value={field.value} onChange={field.onChange} name="nacional" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instrumental"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrumental</FormLabel>
                  <SimNaoRadio value={field.value} onChange={field.onChange} name="instrumental" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Classificação</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="generoMusicalCodigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero</FormLabel>
                  <SelectField
                    value={field.value}
                    onValueChange={field.onChange}
                    options={generoOptions}
                    placeholder="Selecione"
                    allowEmpty
                    emptyLabel="Selecione"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idiomaSigla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idioma</FormLabel>
                  <SelectField
                    value={field.value}
                    onValueChange={field.onChange}
                    options={idiomaOptions}
                    placeholder="Selecione"
                    allowEmpty
                    emptyLabel="Selecione"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="composta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Obra composta</FormLabel>
                  <SimNaoRadio value={field.value} onChange={field.onChange} name="composta" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipoObraComposta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de obra composta</FormLabel>
                  <SelectField
                    value={field.value}
                    onValueChange={field.onChange}
                    options={tipoObraCompostaOptions}
                    disabled={!composta}
                    placeholder="Selecione"
                    allowEmpty
                    emptyLabel="Selecione"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="derivada"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Tipo de obra</FormLabel>
                  <RadioGroup>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        id="derivada-n"
                        name="derivada"
                        checked={field.value === 'N'}
                        onChange={() => field.onChange('N')}
                      />
                      <RadioGroupLabel htmlFor="derivada-n">Original</RadioGroupLabel>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        id="derivada-s"
                        name="derivada"
                        checked={field.value === 'S'}
                        onChange={() => field.onChange('S')}
                      />
                      <RadioGroupLabel htmlFor="derivada-s">Derivada</RadioGroupLabel>
                    </div>
                  </RadioGroup>
                </FormItem>
              )}
            />
            {derivada === 'S' && (
              <>
                <FormField
                  control={form.control}
                  name="obraOriginalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código SOC (obra original)</FormLabel>
                      <FormControl>
                        <Input value={field.value ?? ''} readOnly className="bg-muted/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="obraOriginalCodigoEcad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código ECAD</FormLabel>
                      <FormControl>
                        <Input value={field.value ?? ''} readOnly className="bg-muted/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="obraOriginalTitulo"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Obra original</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted/50" />
                        </FormControl>
                        <ObraMusicalSearchModal
                          onSelect={(obra) => {
                            form.setValue('obraOriginalId', obra.id)
                            form.setValue('obraOriginalTitulo', obra.titulo)
                            form.setValue('obraOriginalCodigoEcad', obra.codigoEcad)
                          }}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Anexos (opcional)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {FILE_FIELDS.map((f) => (
              <FormField
                key={f.key}
                control={form.control}
                name={f.key}
                render={({ field }) => (
                  <FormItem>
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border p-4 text-center transition-colors hover:bg-muted/30">
                      <Upload className="size-6 text-muted-foreground" />
                      <p className="text-sm font-medium">{f.label}</p>
                      <p className="text-xs text-muted-foreground">{f.hint}</p>
                      {field.value instanceof File && (
                        <p className="text-xs text-primary">{field.value.name}</p>
                      )}
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </Form>
  )
}
