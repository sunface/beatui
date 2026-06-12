import { Outlet } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { CommandMenu } from '@/components/features/command-menu'
import { AppSidebar } from '@/components/features/layout/app-sidebar'
import { SkipToMain } from '@/components/features/skip-to-main'
import { type SidebarData } from './types'

type AuthenticatedLayoutProps = {
  sidebarData: SidebarData
  children?: React.ReactNode
}

export function AuthenticatedLayout({
  sidebarData,
  children,
}: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider
          data-component='authenticated-layout'
          defaultOpen={defaultOpen}
        >
          <SkipToMain />
          <AppSidebar data={sidebarData} />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-data-[layout=fixed]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            {children ?? <Outlet />}
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
      <CommandMenu navGroups={sidebarData.navGroups} />
    </SearchProvider>
  )
}
