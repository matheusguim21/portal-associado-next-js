'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type StepperStep = {
  id: string
  title: string
  description?: string
}

type StepperProps = {
  steps: StepperStep[]
  currentStep: number
  onStepClick?: (index: number) => void
  className?: string
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <nav aria-label="Progresso do cadastro" className={cn('w-full', className)}>
      <ol className="flex items-start gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isClickable = onStepClick && isCompleted

          return (
            <li
              key={step.id}
              className={cn(
                'flex flex-1 items-start',
                index < steps.length - 1 && 'min-w-0',
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:items-start sm:gap-3">
                <div className="flex w-full items-center">
                  <Button
                    type="button"
                    size="icon"
                    disabled={!isClickable}
                    onClick={() => isClickable && onStepClick(index)}
                    className={cn(
                      'size-8 shrink-0 rounded-full border-2 text-xs font-semibold',
                      isCompleted &&
                        'border-primary bg-primary text-primary-foreground',
                      isActive && 'border-primary bg-background text-primary',
                      !isCompleted &&
                        !isActive &&
                        'border-border bg-background text-muted-foreground',
                      isClickable && 'cursor-pointer hover:bg-primary/10',
                      !isClickable && 'cursor-default',
                    )}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isCompleted ? <Check className="size-4" /> : index + 1}
                  </Button>

                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'mx-2 h-0.5 flex-1 rounded-full transition-colors',
                        isCompleted ? 'bg-primary' : 'bg-border',
                      )}
                      aria-hidden
                    />
                  )}
                </div>

                <div className="hidden w-full min-w-0 px-0 text-center sm:block sm:px-1 sm:text-left">
                  <p
                    className={cn(
                      'text-sm font-medium leading-snug sm:line-clamp-2',
                      isActive ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground sm:line-clamp-2">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-3 sm:hidden">
        <p className="text-sm font-medium text-foreground">
          {steps[currentStep]?.title}
        </p>
        {steps[currentStep]?.description && (
          <p className="text-xs text-muted-foreground">
            {steps[currentStep].description}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Etapa {currentStep + 1} de {steps.length}
        </p>
      </div>
    </nav>
  )
}
