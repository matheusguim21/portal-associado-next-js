import { NavHubPage } from '@/components/nav-hub-page'
import { getHubChildren } from '@/lib/navigation'

export default function MinhaAreaHubPage() {
  return (
    <NavHubPage
      pathname="/minha-area"
      accent="blue"
      children={getHubChildren('/minha-area')}
    />
  )
}
