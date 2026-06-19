'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { ObraMusicalSearchModal } from '@/components/documentacao/obra-musical/ObraMusicalSearchModal'
import { PoutPourritSearchModal } from '@/components/documentacao/pout-pourrit/PoutPourritSearchModal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem, RadioGroupLabel } from '@/components/ui/radio-group'
import { tipoObmPopOptions } from '@/lib/search/filter-options'
import type { CreateFonogramaFormData } from '@/schemas/create-fonograma-schema'
import type { ObraMusicalApi, PoutPourritApi } from '@/types/api/documentacao'

type FonogramaObraStepProps = {
  form: UseFormReturn<CreateFonogramaFormData>
}

export function FonogramaObraStep({ form }: FonogramaObraStepProps) {
  const [obraModalOpen, setObraModalOpen] = useState(false)
  const [poutModalOpen, setPoutModalOpen] = useState(false)
  const tipoObmPop = form.watch('tipoObmPop')
  const prevTipoObmPop = useRef(tipoObmPop)

  useEffect(() => {
    if (prevTipoObmPop.current !== tipoObmPop && prevTipoObmPop.current !== undefined) {
      form.setValue('obraTitulo', '')
      form.setValue('codigoEcadObraPoutPourrit', undefined)
      form.setValue('codigoSocObraPoutPourrit', undefined)
    }
    prevTipoObmPop.current = tipoObmPop
  }, [tipoObmPop, form])

  function handleObraSelect(obra: ObraMusicalApi) {
    form.setValue('obraTitulo', obra.titulo ?? '', { shouldValidate: true })
    form.setValue('codigoEcadObraPoutPourrit', obra.codigoEcad, { shouldDirty: true })
    form.setValue('codigoSocObraPoutPourrit', obra.id, { shouldValidate: true })
  }

  function handlePoutSelect(pout: PoutPourritApi) {
    form.setValue('obraTitulo', pout.titulo ?? '', { shouldValidate: true })
    form.setValue('codigoEcadObraPoutPourrit', pout.codEcad, { shouldDirty: true })
    form.setValue('codigoSocObraPoutPourrit', pout.id, { shouldValidate: true })
  }

  return (
    <>
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="tipoObmPop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de obra</FormLabel>
                <FormControl>
                  <RadioGroup className="flex flex-wrap gap-4 pt-1">
                    {tipoObmPopOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center gap-2">
                        <RadioGroupItem
                          id={`cad-tipo-${opt.value}`}
                          name="tipoObmPop"
                          value={opt.value}
                          checked={field.value === opt.value}
                          onChange={() => field.onChange(opt.value)}
                        />
                        <RadioGroupLabel htmlFor={`cad-tipo-${opt.value}`}>
                          {opt.label}
                        </RadioGroupLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="obraTitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {tipoObmPop === 'POUT_POURRIT' ? 'Pout-pourrit' : 'Obra musical'}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input {...field} value={field.value ?? ''} readOnly className="cursor-default" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        tipoObmPop === 'POUT_POURRIT'
                          ? setPoutModalOpen(true)
                          : setObraModalOpen(true)
                      }
                    >
                      <Search className="size-4" />
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Form>

      <ObraMusicalSearchModal
        open={obraModalOpen}
        onOpenChange={setObraModalOpen}
        onSelect={handleObraSelect}
        hideTrigger
      />
      <PoutPourritSearchModal
        open={poutModalOpen}
        onOpenChange={setPoutModalOpen}
        onSelect={handlePoutSelect}
        hideTrigger
      />
    </>
  )
}
