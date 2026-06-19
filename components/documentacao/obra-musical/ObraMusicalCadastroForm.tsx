'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  buildObraMusicalCreatePayload,
  useCreateObraMusical,
  useUpdateObraMusical,
} from '@/api/endpoints/documentacao/obra-musical/use-create-obra-musical'
import {
  useUploadObraMusicalArquivo,
  useUploadObraMusicalElementoIaPrompt,
} from '@/api/endpoints/documentacao/obra-musical/use-upload-obra-arquivo'
import { useGetObraMusical } from '@/api/endpoints/documentacao/obra-musical/use-get-obra-musical'
import { CadastroWizard } from '@/components/cadastro/CadastroWizard'
import { ObraMusicalDadosStep } from '@/components/documentacao/obra-musical/ObraMusicalDadosStep'
import { ObraMusicalIaStep } from '@/components/documentacao/obra-musical/ObraMusicalIaStep'
import { ObraMusicalReferenciasStep } from '@/components/documentacao/obra-musical/ObraMusicalReferenciasStep'
import { ObraMusicalResumoStrip } from '@/components/documentacao/obra-musical/ObraMusicalResumoStrip'
import { ObraMusicalRevisaoStep } from '@/components/documentacao/obra-musical/ObraMusicalRevisaoStep'
import { ObraMusicalSubtitulosStep } from '@/components/documentacao/obra-musical/ObraMusicalSubtitulosStep'
import { ObraMusicalTitularesStep } from '@/components/documentacao/obra-musical/ObraMusicalTitularesStep'
import { useTitularId } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api/api-fetch'
import {
  handleMutationError,
  resolveObraMusicalCadastroStepFromError,
} from '@/lib/api/api-error-handler'
import { loadObraMusicalFormData } from '@/lib/documentacao/load-obra-musical-form-data'
import {
  createObraMusicalDefaultValues,
  createObraMusicalSchema,
  dadosStepSchema,
  iaStepSchema,
  obraMusicalCadastroSteps,
  titularesStepSchema,
  type CreateObraMusicalFormData,
} from '@/schemas/create-obra-musical-schema'
import type { ObraMusicalElementoIAGApi } from '@/types/api/documentacao'

const BACK_HREF = '/obras/cadastro'

const ARQUIVO_LABELS: Record<'letra' | 'contrato' | 'audio', string> = {
  letra: 'letra',
  contrato: 'contrato',
  audio: 'áudio',
}

type ObraMusicalCadastroFormProps = {
  obraId?: number
  initialFormData?: CreateObraMusicalFormData
}

async function fetchElementosIa(obraId: number) {
  const { data } = await apiClient.get<ObraMusicalElementoIAGApi[]>(
    `/sipa-documentacao/v1/obras-musicais/${obraId}/arquivos/elementos-ia`,
  )
  return data
}

export function ObraMusicalCadastroForm({ obraId, initialFormData }: ObraMusicalCadastroFormProps) {
  const router = useRouter()
  const titularId = useTitularId()
  const isEditMode = obraId != null && !Number.isNaN(obraId)
  const [step, setStep] = useState(0)
  const [isLoadingObra, setIsLoadingObra] = useState(isEditMode && !initialFormData)
  const { data: obraCarregada, isError: isObraError } = useGetObraMusical(
    isEditMode ? obraId : undefined,
  )
  const { mutate: criarObra, isPending: isCriando } = useCreateObraMusical()
  const { mutate: atualizarObra, isPending: isAtualizando } = useUpdateObraMusical()
  const { mutate: uploadArquivo, isPending: isUploadingArquivo } = useUploadObraMusicalArquivo()
  const { mutate: uploadPrompt, isPending: isUploadingPrompt } = useUploadObraMusicalElementoIaPrompt()
  const isPending = isCriando || isAtualizando || isUploadingArquivo || isUploadingPrompt || isLoadingObra

  const form = useForm<CreateObraMusicalFormData>({
    resolver: zodResolver(createObraMusicalSchema),
    defaultValues: initialFormData ?? createObraMusicalDefaultValues,
    mode: 'onChange',
  })

  const values = form.watch()

  useEffect(() => {
    if (!isEditMode || !obraId || initialFormData) return

    let cancelled = false
    setIsLoadingObra(true)

    loadObraMusicalFormData(obraId)
      .then((formData) => {
        if (cancelled) return
        form.reset(formData)
      })
      .catch(() => {
        if (!cancelled) toast.error('Não foi possível carregar os dados da obra.')
      })
      .finally(() => {
        if (!cancelled) setIsLoadingObra(false)
      })

    return () => {
      cancelled = true
    }
  }, [form, initialFormData, isEditMode, obraId])

  useEffect(() => {
    if (!isEditMode || isLoadingObra || !obraCarregada) return
    if (obraCarregada.status !== 'CAD_TITULAR') {
      toast.error('Somente obras em cadastro podem ser editadas.')
      router.replace(`/obras/cadastro/${obraId}`)
    }
  }, [isEditMode, isLoadingObra, obraCarregada, obraId, router])

  async function validateCurrentStep() {
    const data = form.getValues()

    if (step === 0) {
      const result = dadosStepSchema.safeParse(data)
      if (!result.success) {
        toast.error(result.error.issues[0]?.message ?? 'Verifique os dados da obra.')
        await form.trigger([
          'titulo',
          'derivada',
          'obraOriginalId',
          'composta',
          'tipoObraComposta',
        ])
        return false
      }
      if (data.derivada === 'S' && !data.obraOriginalId) {
        toast.error('Selecione a obra original.')
        return false
      }
      if (data.composta && !data.tipoObraComposta) {
        toast.error('Selecione o tipo de obra composta.')
        return false
      }
      return true
    }

    if (step === 1) {
      const result = titularesStepSchema.safeParse(data)
      if (!result.success) {
        toast.error(result.error.issues[0]?.message ?? 'Verifique os titulares.')
        return false
      }
      return true
    }

    if (step === 4) {
      const result = iaStepSchema.safeParse(data)
      if (!result.success) {
        toast.error(result.error.issues[0]?.message ?? 'Informe os dados de IA.')
        await form.trigger(['usoIA', 'tpUsoIA', 'linkAudio', 'elementosIa'])
        return false
      }
    }

    return true
  }

  async function handleNext() {
    const valid = await validateCurrentStep()
    if (!valid) return
    setStep((s) => Math.min(s + 1, obraMusicalCadastroSteps.length - 1))
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function handleStepClick(index: number) {
    if (index < step) setStep(index)
  }

  function finalizarCadastro(mensagem = 'Obra salva com sucesso!') {
    toast.success(mensagem)
    router.push(BACK_HREF)
  }

  function uploadArquivosObra(targetObraId: number, data: CreateObraMusicalFormData) {
    const uploads: Array<{ tipo: 'letra' | 'contrato' | 'audio'; file: File }> = []
    if (data.letraFile) uploads.push({ tipo: 'letra', file: data.letraFile })
    if (data.contratoFile) uploads.push({ tipo: 'contrato', file: data.contratoFile })
    if (data.audioFile) uploads.push({ tipo: 'audio', file: data.audioFile })

    if (uploads.length === 0) {
      uploadPromptsObra(targetObraId, data)
      return
    }

    let index = 0
    const uploadNext = () => {
      const current = uploads[index]
      if (!current) {
        uploadPromptsObra(targetObraId, data)
        return
      }
      uploadArquivo(
        { obraId: targetObraId, tipo: current.tipo, arquivo: current.file },
        {
          onSuccess: () => {
            index += 1
            uploadNext()
          },
          onError: (error) => {
            handleMutationError(error)
            toast.error(
              `Obra salva, mas falhou ao enviar o arquivo de ${ARQUIVO_LABELS[current.tipo]}.`,
            )
          },
        },
      )
    }
    uploadNext()
  }

  function uploadPromptsObra(targetObraId: number, data: CreateObraMusicalFormData) {
    const elementosComPrompt = data.elementosIa.filter((e) => (e.promptFiles?.length ?? 0) > 0)
    if (elementosComPrompt.length === 0) {
      finalizarCadastro()
      return
    }

    fetchElementosIa(targetObraId)
      .then((elementosSalvos) => {
        const promptUploads: Array<{ elementoIagId: number; arquivo: File }> = []
        for (const elementoForm of elementosComPrompt) {
          const salvo = elementosSalvos.find(
            (e) => String(e.elemento?.codigo) === elementoForm.elementoCodigo,
          )
          if (!salvo?.id) continue
          for (const file of elementoForm.promptFiles ?? []) {
            promptUploads.push({ elementoIagId: salvo.id, arquivo: file })
          }
        }

        if (promptUploads.length === 0) {
          finalizarCadastro()
          return
        }

        let index = 0
        const uploadNext = () => {
          const current = promptUploads[index]
          if (!current) {
            finalizarCadastro()
            return
          }
          uploadPrompt(
            { obraId: targetObraId, elementoIagId: current.elementoIagId, arquivo: current.arquivo },
            {
              onSuccess: () => {
                index += 1
                uploadNext()
              },
              onError: (error) => {
                handleMutationError(error)
                toast.error('Obra salva, mas falhou ao enviar prompts de IA.')
              },
            },
          )
        }
        uploadNext()
      })
      .catch(() => {
        toast.error('Obra salva, mas falhou ao enviar prompts de IA.')
        router.push(BACK_HREF)
      })
  }

  function handleSubmit() {
    const data = form.getValues()
    const result = createObraMusicalSchema.safeParse(data)
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Verifique os dados antes de enviar.')
      return
    }
    if (!titularId) {
      toast.error('Titular não identificado na sessão.')
      return
    }

    const payload = buildObraMusicalCreatePayload(data)
    const hasArquivos = data.letraFile || data.contratoFile || data.audioFile
    const hasPrompts = data.elementosIa.some((e) => (e.promptFiles?.length ?? 0) > 0)

    if (isEditMode && obraId) {
      atualizarObra(
        { id: obraId, payload },
        {
          onSuccess: () => {
            if (hasArquivos || hasPrompts) {
              uploadArquivosObra(obraId, data)
            } else {
              finalizarCadastro()
            }
          },
          onError: (error) => {
            handleMutationError(error)
            const errorStep = resolveObraMusicalCadastroStepFromError(error)
            if (errorStep != null) {
              setStep(errorStep)
            }
          },
        },
      )
      return
    }

    criarObra(payload, {
      onSuccess: (obra) => {
        if (hasArquivos || hasPrompts) {
          uploadArquivosObra(obra.id, data)
        } else {
          finalizarCadastro()
        }
      },
      onError: (error) => {
        handleMutationError(error)
        const errorStep = resolveObraMusicalCadastroStepFromError(error)
        if (errorStep != null) {
          setStep(errorStep)
        }
      },
    })
  }

  const currentStepDef = obraMusicalCadastroSteps[step]
  const isLastStep = step === obraMusicalCadastroSteps.length - 1

  if (isEditMode && (isObraError || (!isLoadingObra && !obraCarregada))) {
    return <p className="text-sm text-muted-foreground">Obra não encontrada.</p>
  }

  return (
    <CadastroWizard
      title={isEditMode ? 'Cadastro SOCINPRO — Editar Obra Musical' : 'Cadastro SOCINPRO — Nova Obra Musical'}
      description={
        isEditMode
          ? 'Atualize os dados da obra musical antes de gerar a ocorrência.'
          : 'Preencha os dados da nova obra musical para envio à SOCINPRO.'
      }
      backHref={BACK_HREF}
      cancelHref={BACK_HREF}
      steps={[...obraMusicalCadastroSteps]}
      currentStep={step}
      onStepClick={handleStepClick}
      stepTitle={currentStepDef.title}
      onBack={handleBack}
      onNext={handleNext}
      onSubmit={handleSubmit}
      isFirstStep={step === 0}
      isLastStep={isLastStep}
      isPending={isPending}
      submitLabel={isEditMode ? 'Salvar obra' : 'Salvar obra'}
    >
      {isLoadingObra ? (
        <p className="text-sm text-muted-foreground">Carregando dados da obra...</p>
      ) : (
        <>
          {step > 0 && (
            <div className="mb-4">
              <ObraMusicalResumoStrip values={values} />
            </div>
          )}
          {step === 0 && <ObraMusicalDadosStep form={form} />}
          {step === 1 && <ObraMusicalTitularesStep form={form} />}
          {step === 2 && <ObraMusicalSubtitulosStep form={form} />}
          {step === 3 && <ObraMusicalReferenciasStep form={form} />}
          {step === 4 && <ObraMusicalIaStep form={form} />}
          {step === 5 && <ObraMusicalRevisaoStep values={values} />}
        </>
      )}
    </CadastroWizard>
  )
}
