'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useElementosObra } from '@/api/endpoints/documentacao/diversos/use-diversos-queries'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectField } from '@/components/ui/select-field'
import {
  obraMusicalElementoIaItemSchema,
  type ObraMusicalElementoIaItem,
} from '@/schemas/create-obra-musical-schema'

type ObraMusicalElementoIaModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: ObraMusicalElementoIaItem
  onSave: (value: ObraMusicalElementoIaItem) => void
}

export function ObraMusicalElementoIaModal({
  open,
  onOpenChange,
  initialValue,
  onSave,
}: ObraMusicalElementoIaModalProps) {
  const {
    data: elementos,
    isLoading,
    isError,
    errorMessage,
  } = useElementosObra()
  const form = useForm<ObraMusicalElementoIaItem>({
    resolver: zodResolver(obraMusicalElementoIaItemSchema),
    defaultValues: {
      elementoCodigo: '',
      ferramentas: '',
      observacao: '',
      promptFiles: [],
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      initialValue ?? {
        elementoCodigo: '',
        ferramentas: '',
        observacao: '',
        promptFiles: [],
      },
    )
  }, [open, initialValue, form])

  const elementoOptions =
    elementos
      ?.filter((e) => e.codigo != null)
      .map((e) => ({
        value: String(e.codigo),
        label: e.nome ?? String(e.codigo),
      })) ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{initialValue ? 'Editar elemento IA' : 'Novo elemento IA'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              onSave(data)
              onOpenChange(false)
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="elementoCodigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elemento</FormLabel>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Carregando elementos...</p>
                  ) : isError ? (
                    <p className="text-sm text-destructive">
                      {errorMessage ?? 'Não foi possível carregar os tipos de elemento.'}
                    </p>
                  ) : elementoOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum tipo de elemento disponível.
                    </p>
                  ) : (
                    <SelectField
                      value={field.value}
                      onValueChange={field.onChange}
                      options={elementoOptions}
                      placeholder="Selecione"
                      emptyLabel="Selecione"
                      contentClassName="z-[100]"
                    />
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ferramentas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo ferramenta</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promptFiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arquivos de prompt (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? [])
                        field.onChange(files)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || elementoOptions.length === 0}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
