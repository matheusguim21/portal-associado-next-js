'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCategoriasReferencia } from '@/api/endpoints/documentacao/diversos/use-diversos-queries'
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
  obraMusicalReferenciaItemSchema,
  type ObraMusicalReferenciaItem,
} from '@/schemas/create-obra-musical-schema'

type ObraMusicalReferenciaModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: ObraMusicalReferenciaItem
  onSave: (value: ObraMusicalReferenciaItem) => void
}

export function ObraMusicalReferenciaModal({
  open,
  onOpenChange,
  initialValue,
  onSave,
}: ObraMusicalReferenciaModalProps) {
  const { data: categorias } = useCategoriasReferencia()
  const form = useForm<ObraMusicalReferenciaItem>({
    resolver: zodResolver(obraMusicalReferenciaItemSchema),
    defaultValues: { referencia: '', categoriaCodigo: '' },
  })

  useEffect(() => {
    if (!open) return
    form.reset(initialValue ?? { referencia: '', categoriaCodigo: '' })
  }, [open, initialValue, form])

  const categoriaOptions =
    categorias?.map((c) => ({
      value: c.codigo ?? '',
      label: c.descricao ?? c.codigo ?? '',
    })) ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValue ? 'Editar referência' : 'Nova referência'}</DialogTitle>
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
              name="referencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referência</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoriaCodigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <SelectField
                    value={field.value}
                    onValueChange={field.onChange}
                    options={categoriaOptions}
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
