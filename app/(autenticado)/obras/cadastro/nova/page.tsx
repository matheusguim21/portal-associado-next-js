import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ObraMusicalCadastroForm } from '@/components/documentacao/obra-musical/ObraMusicalCadastroForm'
import { prefetchObraCadastroDiversos } from '@/lib/api/prefetch-diversos-server'
import { getQueryClient } from '@/lib/api/get-query-client'

export default async function NovaObraMusicaPage() {
  const queryClient = getQueryClient()
  await prefetchObraCadastroDiversos(queryClient)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ObraMusicalCadastroForm />
    </HydrationBoundary>
  )
}
