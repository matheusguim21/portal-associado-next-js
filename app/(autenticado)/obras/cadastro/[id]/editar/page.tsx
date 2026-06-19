import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { EditarObraMusicaPageContent } from '@/components/documentacao/obra-musical/EditarObraMusicaPageContent'
import { prefetchObraCadastroDiversos } from '@/lib/api/prefetch-diversos-server'
import { getQueryClient } from '@/lib/api/get-query-client'
import { loadObraMusicalFormDataServer } from '@/lib/documentacao/load-obra-musical-form-data-server'

export default async function EditarObraMusicaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const obraId = Number(id)
  const queryClient = getQueryClient()

  await prefetchObraCadastroDiversos(queryClient)

  let initialFormData

  if (!Number.isNaN(obraId)) {
    try {
      initialFormData = await loadObraMusicalFormDataServer(obraId)
    } catch {
      initialFormData = undefined
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditarObraMusicaPageContent obraId={obraId} initialFormData={initialFormData} />
    </HydrationBoundary>
  )
}
