import { NavHubPage } from '@/components/nav-hub-page'
import { profileNav } from '@/lib/navigation'

export default function PerfilHubPage() {
  return <NavHubPage pathname="/perfil" children={profileNav} />
}
