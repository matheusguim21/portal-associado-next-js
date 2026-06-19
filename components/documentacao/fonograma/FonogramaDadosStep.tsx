'use client'

import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { useGerarIsrc } from '@/api/endpoints/documentacao/fonograma/use-create-fonograma'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import { Switch } from '@/components/ui/switch'
import { useTitularId } from '@/hooks/use-auth'
import { formatIsrc } from '@/lib/masks'
import type { CreateFonogramaFormData } from '@/schemas/create-fonograma-schema'

type FonogramaDadosStepProps = {
  form: UseFormReturn<CreateFonogramaFormData>
}

export function FonogramaDadosStep({ form }: FonogramaDadosStepProps) {
  const titularId = useTitularId()
  const { mutate: gerarIsrc, isPending: isGerandoIsrc } = useGerarIsrc()

  function handleGerarIsrc() {
    if (!titularId) {
      toast.error('Titular não identificado na sessão.')
      return
    }
    gerarIsrc(titularId, {
      onSuccess: (result) => {
        form.setValue('isrc', formatIsrc(result.isrc))
        toast.success('ISRC gerado com sucesso.')
      },
    })
  }

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="isrc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISRC</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <MaskedInput
                    mask="isrc"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder="XX-XXX-XX-XXXX"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGerarIsrc}
                  disabled={isGerandoIsrc}
                >
                  Gerar ISRC
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gra"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GRA</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="numeric"
                  maxDigits={8}
                  value={field.value ?? ''}
                  onChange={field.onChange}
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
          name="nacional"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-3 sm:col-span-2">
              <FormLabel className="cursor-pointer">Fonograma Nacional</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instrumental"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-3 sm:col-span-2">
              <FormLabel className="cursor-pointer">Instrumental</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
