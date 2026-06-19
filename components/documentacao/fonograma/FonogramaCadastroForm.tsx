'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  buildFonogramaCreatePayload,
  buildTitularesComPercentualAutomatico,
  useCreateFonograma,
} from '@/api/endpoints/documentacao/fonograma/use-create-fonograma'
import { CadastroWizard } from '@/components/cadastro/CadastroWizard'
import { FonogramaDadosStep } from '@/components/documentacao/fonograma/FonogramaDadosStep'
import { FonogramaObraStep } from '@/components/documentacao/fonograma/FonogramaObraStep'
import { FonogramaRevisaoStep } from '@/components/documentacao/fonograma/FonogramaRevisaoStep'
import { useTitularId } from '@/hooks/use-auth'
import {
  createFonogramaDefaultValues,
  createFonogramaSchema,
  dadosStepSchema,
  fonogramaCadastroSteps,
  obraStepSchema,
  type CreateFonogramaFormData,
} from '@/schemas/create-fonograma-schema'

const BACK_HREF = '/fonogramas/cadastro'

export function FonogramaCadastroForm() {
  const router = useRouter()
  const titularId = useTitularId()
  const [step, setStep] = useState(0)
  const { mutate: criarFonograma, isPending } = useCreateFonograma()

  const form = useForm<CreateFonogramaFormData>({
    resolver: zodResolver(createFonogramaSchema),
    defaultValues: createFonogramaDefaultValues,
    mode: 'onChange',
  })

  const values = form.watch()

  async function handleNext() {
    if (step === 0) {
      const data = form.getValues()
      const result = obraStepSchema.safeParse(data)
      if (!result.success) {
        const message = result.error.issues[0]?.message ?? 'Preencha os campos obrigatórios.'
        toast.error(message)
        await form.trigger(['tipoObmPop', 'obraTitulo', 'codigoSocObraPoutPourrit'])
        return
      }
    }
    if (step === 1) {
      const data = form.getValues()
      const result = dadosStepSchema.safeParse(data)
      if (!result.success) {
        const message = result.error.issues[0]?.message ?? 'Verifique os dados do fonograma.'
        toast.error(message)
        await form.trigger(['isrc', 'duracao', 'gra', 'nacional', 'instrumental'])
        return
      }
    }
    setStep((s) => Math.min(s + 1, fonogramaCadastroSteps.length - 1))
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function handleStepClick(index: number) {
    if (index < step) setStep(index)
  }

  function handleSubmit() {
    const data = form.getValues()
    const parsed = createFonogramaSchema.safeParse(data)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Verifique os dados do formulário.')
      setStep(0)
      return
    }
    if (!titularId) {
      toast.error('Titular não identificado na sessão.')
      return
    }

    const titulares = buildTitularesComPercentualAutomatico(titularId)
    criarFonograma(buildFonogramaCreatePayload(parsed.data, titulares), {
      onSuccess: () => {
        toast.success('Fonograma cadastrado com sucesso! Aguardando validação.')
        router.push(BACK_HREF)
      },
    })
  }

  const currentStepDef = fonogramaCadastroSteps[step]
  const isLastStep = step === fonogramaCadastroSteps.length - 1

  return (
    <CadastroWizard
      title="Cadastro SOCINPRO — Novo Fonograma"
      description="Preencha os dados do novo fonograma para envio à SOCINPRO."
      backHref={BACK_HREF}
      cancelHref={BACK_HREF}
      steps={[...fonogramaCadastroSteps]}
      currentStep={step}
      onStepClick={handleStepClick}
      stepTitle={currentStepDef.title}
      onBack={handleBack}
      onNext={handleNext}
      onSubmit={handleSubmit}
      isFirstStep={step === 0}
      isLastStep={isLastStep}
      isPending={isPending}
      submitLabel="Cadastrar fonograma"
    >
      {step === 0 && <FonogramaObraStep form={form} />}
      {step === 1 && <FonogramaDadosStep form={form} />}
      {step === 2 && <FonogramaRevisaoStep values={values} />}
    </CadastroWizard>
  )
}
