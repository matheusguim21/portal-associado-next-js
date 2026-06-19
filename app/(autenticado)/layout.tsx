'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { AppBreadcrumb } from '@/components/app-breadcrumb'
import { AreaShell } from '@/components/area-shell'
import { ThemeToggle } from '@/components/theme-toggle'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card/80 backdrop-blur-sm px-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
          <AppBreadcrumb />
          <ThemeToggle className="ml-auto" />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <AreaShell>{children}</AreaShell>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
