import { NavHubPage } from '@/components/nav-hub-page'
import { getHubChildren } from '@/lib/navigation'

export default function FinanceiroHubPage() {
  return (
    <NavHubPage
      pathname="/financeiro"
      accent="emerald"
      children={getHubChildren('/financeiro')}
    />
  )
}
