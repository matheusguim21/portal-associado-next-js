'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTiposTitulo } from '@/api/endpoints/documentacao/diversos/use-diversos-queries'
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
  obraMusicalSubtituloItemSchema,
  type ObraMusicalSubtituloItem,
} from '@/schemas/create-obra-musical-schema'

type ObraMusicalSubtituloModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: ObraMusicalSubtituloItem
  onSave: (value: ObraMusicalSubtituloItem) => void
}

export function ObraMusicalSubtituloModal({
  open,
  onOpenChange,
  initialValue,
  onSave,
}: ObraMusicalSubtituloModalProps) {
  const { data: tiposTitulo } = useTiposTitulo()
  const form = useForm<ObraMusicalSubtituloItem>({
    resolver: zodResolver(obraMusicalSubtituloItemSchema),
    defaultValues: { subtitulo: '', tipoTitulo: '' },
  })

  useEffect(() => {
    if (!open) return
    form.reset(initialValue ?? { subtitulo: '', tipoTitulo: '' })
  }, [open, initialValue, form])

  const tipoOptions =
    tiposTitulo?.map((t) => ({
      value: t.codigo ?? '',
      label: t.descricao ?? t.codigo ?? '',
    })) ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValue ? 'Editar subtítulo' : 'Novo subtítulo'}</DialogTitle>
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
              name="subtitulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipoTitulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo título</FormLabel>
                  <SelectField
                    value={field.value}
                    onValueChange={field.onChange}
                    options={tipoOptions}
                    allowEmpty={false}
                  />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
