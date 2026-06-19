import { NavHubPage } from '@/components/nav-hub-page'
import { getHubChildren } from '@/lib/navigation'

export default function ObrasHubPage() {
  return (
    <NavHubPage
      pathname="/obras"
      accent="amber"
      children={getHubChildren('/obras')}
    />
  )
}
