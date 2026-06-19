import { CadastroObraMusicalPageContent } from '@/components/documentacao/obra-musical/CadastroObraMusicalPageContent'
import { fetchMeusObrasServer } from '@/lib/api/server-data'
import { getServerTitularId } from '@/lib/auth/server-auth'
import type { SearchObraMusicalFormData } from '@/schemas/search-obra-musical-schema'
import { obraFormToApiParams } from '@/lib/search/to-api-params'

const INITIAL_FILTERS: SearchObraMusicalFormData = {
  pesquisa: 'COMECANDO',
  titulo: '',
}

export default async function CadastroObraMusicalPage() {
  const titularId = await getServerTitularId()
  let initialSearch

  if (titularId) {
    try {
      const data = await fetchMeusObrasServer({
        ...obraFormToApiParams(INITIAL_FILTERS, { page: 0, size: 10, sort: 'id,desc' }),
        titularId,
        sort: 'id,desc',
      })

      initialSearch = {
        filters: INITIAL_FILTERS,
        results: data.content ?? [],
        page: data.number ?? 0,
        size: data.size ?? 10,
        totalElements: data.totalElements ?? 0,
        totalPages: data.totalPages ?? 0,
        sort: 'id,desc',
      }
    } catch {
      initialSearch = undefined
    }
  }

  return <CadastroObraMusicalPageContent initialSearch={initialSearch} />
}
