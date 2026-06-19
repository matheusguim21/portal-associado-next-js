import { NavHubPage } from '@/components/nav-hub-page'
import { getHubChildren } from '@/lib/navigation'

export default function FonogramasHubPage() {
  return (
    <NavHubPage
      pathname="/fonogramas"
      accent="violet"
      children={getHubChildren('/fonogramas')}
    />
  )
}
