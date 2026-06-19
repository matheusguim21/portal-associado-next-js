import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { CadastroFonogramaPageContent } from '@/components/documentacao/fonograma/CadastroFonogramaPageContent'
import { prefetchIsrcHabilitado } from '@/lib/api/prefetch-diversos-server'
import { getQueryClient } from '@/lib/api/get-query-client'
import { getServerTitularId } from '@/lib/auth/server-auth'

export default async function CadastroFonogramaPage() {
  const titularId = await getServerTitularId()
  const queryClient = getQueryClient()

  await prefetchIsrcHabilitado(queryClient, titularId)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CadastroFonogramaPageContent />
    </HydrationBoundary>
  )
}
