import { NavBlockCard } from '@/components/nav-block-card'
import { PageHeader } from '@/components/page-header'
import type { NavBlock, NavNode } from '@/lib/navigation'
import { findNodeForHref } from '@/lib/navigation'

type NavHubPageProps = {
  pathname: string
  children: NavNode[] | NavBlock[]
  variant?: 'blocks' | 'tools'
  accent?: string
}

function isNavBlock(item: NavNode | NavBlock): item is NavBlock {
  return 'id' in item && 'accent' in item
}

export function NavHubPage({ pathname, children, variant = 'tools', accent }: NavHubPageProps) {
  const node = findNodeForHref(pathname)
  const blockAccent = accent ?? (node && 'accent' in node ? node.accent : 'brand')

  return (
    <div className="space-y-6">
      <PageHeader
        title={node?.label ?? 'Navegação'}
        description={node?.description ?? 'Selecione uma opção abaixo'}
      />
      {variant === 'blocks' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child, index) => {
            if (!isNavBlock(child)) return null
            return (
              <NavBlockCard
                key={child.id}
                href={child.href}
                label={child.label}
                description={child.description}
                icon={child.icon}
                accent={child.accent}
                index={index}
              />
            )
          })}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child, index) => {
            if (isNavBlock(child) || !child.icon || !child.description) return null

            return (
              <NavBlockCard
                key={child.href ?? child.label}
                href={child.href ?? '#'}
                label={child.label}
                description={child.description}
                icon={child.icon}
                accent={blockAccent}
                index={index}
                variant="tool"
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
