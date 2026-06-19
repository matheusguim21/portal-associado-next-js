'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SocinproLogo } from '@/components/socinpro-logo'
import {
  getActiveBlock,
  getBlockChildren,
  navigationBlocks,
  type NavBlock,
  type NavNode,
} from '@/lib/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavUser } from '@/components/nav-user'

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/')
}

const activeLinkClass =
  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'

const blockAccentBorder: Record<string, string> = {
  brand: 'border-l-primary',
  violet: 'border-l-violet-500',
  amber: 'border-l-amber-500',
  blue: 'border-l-blue-500',
  emerald: 'border-l-emerald-500',
}

function BlockNavItem({ block, pathname }: { block: NavBlock; pathname: string }) {
  const Icon = block.icon
  const active = isActive(pathname, block.href)
  const accentBorder = blockAccentBorder[block.accent] ?? blockAccentBorder.brand

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active}
        tooltip={block.label}
        render={
          <Link
            href={block.href}
            className={cn(
              'flex items-center gap-2',
              active && activeLinkClass,
              active && `border-l-2 ${accentBorder}`,
            )}
          />
        }
      >
        <Icon className="size-4" />
        <span>{block.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function ToolNavItem({ item, pathname }: { item: NavNode; pathname: string }) {
  const Icon = item.icon
  const active = item.href ? isActive(pathname, item.href) : false

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active}
        tooltip={item.label}
        render={
          <Link
            href={item.href ?? '#'}
            className={cn('flex items-center gap-2', active && activeLinkClass)}
          />
        }
      >
        {Icon && <Icon className="size-4" />}
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const activeBlock = getActiveBlock(pathname)
  const toolItems = activeBlock ? getBlockChildren(activeBlock.id) : []
  const onInicio = pathname === '/inicio'

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [pathname, isMobile, setOpenMobile])

  return (
    <Sidebar collapsible="icon" className="sidebar-transition">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <Link href="/inicio" className="flex items-center gap-2.5 min-w-0">
          <SocinproLogo size={28} />
          <div className="min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-sidebar-foreground tracking-wide">SOCINPRO</p>
            <p className="text-xs text-muted-foreground truncate">Portal do Associado</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Áreas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationBlocks.map((block) => (
                <BlockNavItem key={block.id} block={block} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {activeBlock && toolItems.length > 0 && !onInicio && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              {activeBlock.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {toolItems.map((item) => (
                  <ToolNavItem key={item.href ?? item.label} item={item} pathname={pathname} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
