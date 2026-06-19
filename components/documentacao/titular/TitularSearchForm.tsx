'use client'

import { RotateCcw, Search } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  searchTitularSchema,
  type SearchTitularFormData,
  type SearchTitularFormInput,
} from '@/schemas/search-titular-schema'
import { holderStatusOptions, searchKindOptions } from '@/lib/search/filter-options'
import { validateTitularFilters } from '@/lib/search/validate-integracao-filters'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MaskedInput } from '@/components/ui/masked-input'
import { SelectField } from '@/components/ui/select-field'
import { Switch } from '@/components/ui/switch'

const defaultValues: Partial<SearchTitularFormInput> = {
  pesquisa: 'COMECANDO',
  nome: '',
  email: '',
  pseudonimo: '',
  cpfCnpj: '',
  celular: '',
  id: '',
  codigoEcad: '',
  codigoCae: '',
  codigoIpi: '',
  codigoIpn: '',
  situacaoCadastro: undefined,
  nacional: undefined,
}

type TitularSearchFormProps = {
  onSubmit: (data: SearchTitularFormData) => void
  isPending?: boolean
  initialValues?: Partial<SearchTitularFormInput>
}

export function TitularSearchForm({
  onSubmit,
  isPending,
  initialValues,
}: TitularSearchFormProps) {
  const form = useForm<SearchTitularFormInput, unknown, SearchTitularFormData>({
    resolver: zodResolver(searchTitularSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      pesquisa: initialValues?.pesquisa ?? 'CONTENDO',
    },
  })

  function handleSubmit(data: SearchTitularFormData) {
    const validationError = validateTitularFilters(data)
    if (validationError) {
      toast.error(validationError)
      return
    }
    onSubmit(data)
  }

  function submitForm() {
    form.handleSubmit(handleSubmit)()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submitForm()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            submitForm()
          }
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-12">
            <FormField
              control={form.control}
              name="pesquisa"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 xl:col-span-1 2xl:col-span-2">
                  <FormLabel>Pesquisa</FormLabel>
                  <FormControl>
                    <SelectField
                      value={field.value}
                      onValueChange={field.onChange}
                      options={searchKindOptions}
                      allowEmpty={false}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 xl:col-span-3 2xl:col-span-4">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" {...field} value={field.value ?? ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 xl:col-span-2 2xl:col-span-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pseudonimo"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 xl:col-span-2 2xl:col-span-3">
                  <FormLabel>Pseudônimo</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 xl:col-span-2">
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <MaskedInput mask="cpfCnpj" {...field} value={field.value ?? ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 xl:col-span-2">
                  <FormLabel>Celular</FormLabel>
                  <FormControl>
                    <MaskedInput
                      mask="phone"
                      autoComplete="tel"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 xl:col-span-1 2xl:col-span-2">
                  <FormLabel>Código SOC</FormLabel>
                  <FormControl>
                    <MaskedInput
                      mask="numeric"
                      maxDigits={15}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigoEcad"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 xl:col-span-1 2xl:col-span-2">
                  <FormLabel>Código ECAD</FormLabel>
                  <FormControl>
                    <MaskedInput
                      mask="numeric"
                      maxDigits={15}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigoCae"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 xl:col-span-1 2xl:col-span-2">
                  <FormLabel>CAE</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      className="no-spinner"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigoIpi"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 xl:col-span-1 2xl:col-span-2">
                  <FormLabel>IPI</FormLabel>
                  <FormControl>
                    <MaskedInput mask="ipi" {...field} value={field.value ?? ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigoIpn"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 xl:col-span-1 2xl:col-span-2">
                  <FormLabel>IPN</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      className="no-spinner"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="situacaoCadastro"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 xl:col-span-1 2xl:col-span-2">
                  <FormLabel>Situação</FormLabel>
                  <FormControl>
                    <SelectField
                      value={field.value}
                      onValueChange={field.onChange}
                      options={holderStatusOptions}
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
                  <FormControl>
                    <fieldset className="space-y-1">
                      <legend className="text-sm font-medium">Nacional</legend>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            id="nacionalYes"
                            checked={field.value === 'S'}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? 'S' : undefined)
                            }
                          />
                          <Label htmlFor="nacionalYes" className="text-sm font-medium">
                            Sim
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="nacionalNo"
                            checked={field.value === 'N'}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? 'N' : undefined)
                            }
                          />
                          <Label htmlFor="nacionalNo" className="text-sm font-medium">
                            Não
                          </Label>
                        </div>
                      </div>
                    </fieldset>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="w-full sm:mr-auto sm:w-auto"
                >
                  Cancelar
                </Button>
              }
            />
            <Button
              type="button"
              disabled={isPending}
              onClick={submitForm}
              className="w-full sm:w-auto"
            >
              <Search />
              {isPending ? 'Pesquisando...' : 'Pesquisar'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => form.reset(defaultValues)}
              className="w-full sm:w-auto"
            >
              <RotateCcw />
              Limpar
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  )
}
