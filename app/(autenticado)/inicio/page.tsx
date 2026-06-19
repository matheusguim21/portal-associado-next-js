import { NavBlockCard } from '@/components/nav-block-card'
import { PageHeader } from '@/components/page-header'
import { navigationBlocks } from '@/lib/navigation'

export default function InicioPage() {
  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <PageHeader
        title="Portal SOCINPRO"
        description="Selecione uma área para acessar as ferramentas do sistema"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {navigationBlocks.map((block, index) => (
          <NavBlockCard
            key={block.id}
            href={block.href}
            label={block.label}
            description={block.description}
            icon={block.icon}
            accent={block.accent}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
