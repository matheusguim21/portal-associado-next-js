'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Stepper, type StepperStep } from '@/components/ui/stepper'

type CadastroWizardProps = {
  title: string
  description?: string
  backHref: string
  steps: StepperStep[]
  currentStep: number
  onStepClick?: (index: number) => void
  stepTitle: string
  children: React.ReactNode
  onBack: () => void
  onNext: () => void
  onSubmit?: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isPending?: boolean
  nextLabel?: string
  submitLabel?: React.ReactNode
  cancelHref: string
}

export function CadastroWizard({
  title,
  description,
  backHref,
  steps,
  currentStep,
  onStepClick,
  stepTitle,
  children,
  onBack,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
  isPending,
  nextLabel = 'Continuar',
  submitLabel = 'Cadastrar',
  cancelHref,
}: CadastroWizardProps) {
  return (
    <div className="mx-auto w-full  space-y-6">
      <Button variant="ghost" size="sm" render={<Link href={backHref} />}>
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Voltar
      </Button>

      <PageHeader title={title} description={description} />

      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepClick}
        className="mb-2"
      />

      <Card>
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-base">{stepTitle}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">{children}</CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" render={<Link href={cancelHref} />}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
                <ArrowLeft className="size-4" data-icon="inline-start" />
                Etapa anterior
              </Button>
            )}
            {isLastStep ? (
              <Button type="button" onClick={onSubmit} disabled={isPending}>
                {isPending ? 'Salvando...' : submitLabel}
              </Button>
            ) : (
              <Button type="button" onClick={onNext} disabled={isPending}>
                {nextLabel}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
