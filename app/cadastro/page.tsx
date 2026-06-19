'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Check, FileText, Hash, IdCard, LogIn, User } from 'lucide-react'
import { toast } from 'sonner'
import {
  authPrimaryButtonClass,
  authSecondaryButtonClass,
} from '@/components/auth/auth-button-classes'
import { AuthInputGroup } from '@/components/auth/AuthInputGroup'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { MaskedInput } from '@/components/ui/masked-input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const steps = ['Identificação', 'Confirmação', 'Criar acesso']

export default function CadastroPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [codigoSoc, setCodigoSoc] = useState('')
  const [cpfCnpj, setCpfCnpj] = useState('')

  async function handleNext(e: React.FormEvent) {
    e.preventDefault()
    if (step < 2) {
      setStep((s) => s + 1)
    } else {
      setLoading(true)
      // TODO: integrar com sipa-auth
      await new Promise((r) => setTimeout(r, 800))
      toast.success('Cadastro realizado! Faça o login para continuar.')
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      wide
      title="Cadastre-se"
      subtitle="Informe seus dados para cadastro"
    >
      <div className="mb-5 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                'flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                i < step
                  ? 'border-primary bg-primary text-primary-foreground'
                  : i === step
                    ? 'border-white text-white'
                    : 'border-white/40 text-white/60',
              )}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                'hidden text-xs sm:block',
                i === step ? 'font-semibold text-white' : 'text-white/70',
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 && <div className="h-px w-4 bg-white/30 sm:w-6" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleNext} className="flex flex-col gap-3">
        {step === 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AuthInputGroup
              id="codigoSoc"
              name="codigoSoc"
              icon={<Hash className="size-4" />}
              placeholder="Código SOCINPRO"
              inputMode="numeric"
              value={codigoSoc}
              onChange={(e) => setCodigoSoc(e.target.value.replace(/\D/g, ''))}
              required
            />
            <div className="flex w-full items-stretch overflow-hidden rounded-lg shadow-sm">
              <span className="flex min-w-[2.75rem] items-center justify-center border border-border border-r-0 bg-white/96 px-2.5 text-muted-foreground">
                <IdCard className="size-4" />
              </span>
              <MaskedInput
                id="cpfCnpj"
                name="cpfCnpj"
                mask="cpfCnpj"
                value={cpfCnpj}
                onChange={setCpfCnpj}
                placeholder="CPF ou CNPJ"
                required
                className="min-w-0 flex-1 rounded-r-lg rounded-l-none border border-border border-l-0 bg-white/96 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-2 rounded-lg border border-white/20 bg-white/10 p-4 text-sm text-[#fafafa]">
            <p className="font-semibold text-white">Dados do titular encontrado</p>
            <p>
              <span className="text-white/70">Nome:</span> Roberto Carlos
            </p>
            <p>
              <span className="text-white/70">Código SOC:</span> 12345
            </p>
            <p>
              <span className="text-white/70">CPF:</span> ***.***.123-**
            </p>
            <p className="mt-1 text-xs text-white/70">
              Confirme que esses são seus dados para prosseguir.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <AuthInputGroup
                id="usuarioAcesso"
                name="usuarioAcesso"
                icon={<User className="size-4" />}
                placeholder="Nome de usuário de acesso"
                maxLength={30}
                required
              />
              <p className="text-xs text-white/70">
                Apenas letras minúsculas, números e pontos. Máx. 30 caracteres.
              </p>
            </div>
            <AuthInputGroup
              id="nomeApresentacao"
              name="nomeApresentacao"
              icon={<FileText className="size-4" />}
              placeholder="Nome de apresentação"
              required
            />
          </div>
        )}

        <div className="mt-2 flex gap-2">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              className={cn(authSecondaryButtonClass, 'mt-0 flex-1')}
              onClick={() => setStep((s) => s - 1)}
            >
              <span className="flex-1 text-center">Voltar</span>
              <ArrowLeft className="size-4 shrink-0" />
            </Button>
          )}
          <Button
            type="submit"
            className={cn(authPrimaryButtonClass, 'flex-1')}
            disabled={loading}
          >
            <span className="flex-1 text-center">
              {loading ? 'Cadastrando...' : step < 2 ? 'Continuar' : 'Criar acesso'}
            </span>
            <LogIn className="size-4 shrink-0" />
          </Button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-white/80">
        Já sou cadastrado?{' '}
        <Link href="/login" className="font-medium text-white underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
