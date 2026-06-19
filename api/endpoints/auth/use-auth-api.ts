import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApiClient } from '@/lib/api/api-fetch'
import { useAuthStore } from '@/stores/use-auth-store'

export type AuthUsuarioApi = {
  id: number
  email?: string
  nome: string
}

export function useGetAuthUsuario() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await authApiClient.get<AuthUsuarioApi>('/usuario')
      return data
    },
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (payload: { senhaAtual: string; novaSenha: string }) => {
      await authApiClient.put('/usuario/atualiza-senha', payload)
    },
    onSuccess: () => toast.success('Senha alterada com sucesso.'),
    onError: () => toast.error('Não foi possível alterar a senha. Verifique a senha atual.'),
  })
}

export function useRecuperarSenha() {
  return useMutation({
    mutationFn: async (usuario: string) => {
      const body = new URLSearchParams({ usuario })
      const response = await fetch('/api/auth/publico/usuario/esqueceu-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })

      if (!response.ok) {
        throw new Error('Não foi possível solicitar a recuperação de senha.')
      }
    },
    onSuccess: () => toast.success('Instruções enviadas para o e-mail cadastrado.'),
    onError: () => toast.error('Não foi possível solicitar a recuperação de senha.'),
  })
}

export function useUpdateDisplayName() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: async (nome: string) => nome,
    onSuccess: (nome) => {
      if (user) {
        setUser({ ...user, name: nome })
      }
      toast.success('Nome de exibição atualizado.')
    },
  })
}
