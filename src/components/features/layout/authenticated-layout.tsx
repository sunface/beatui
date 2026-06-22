import { Outlet, useLocation } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { CommandMenu } from '@/components/features/command-menu'
import { AppSidebar } from '@/components/features/layout/app-sidebar'
import { SectionNavItemsContext } from '@/components/features/layout/section-nav-context'
import { SkipToMain } from '@/components/features/skip-to-main'
import { type SectionNavItem } from './section-top-nav'
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type SidebarData,
} from './types'

type AuthenticatedLayoutProps = {
  sidebarData: SidebarData
  children?: React.ReactNode
}

export function AuthenticatedLayout({
  sidebarData,
  children,
}: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const pathname = useLocation({ select: (location) => location.pathname })
  const sectionNavItems = getSectionNavItems(sidebarData, pathname)

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
            <SectionNavItemsContext value={sectionNavItems}>
              {children ?? <Outlet />}
            </SectionNavItemsContext>
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
      <CommandMenu navGroups={sidebarData.navGroups} />
    </SearchProvider>
  )
}

function getSectionNavItems(
  sidebarData: SidebarData,
  pathname: string
): SectionNavItem[] {
  const activeItem =
    findActivePrimaryItem(sidebarData, pathname) ??
    sidebarData.navGroups[0]?.items[0]
  if (!activeItem) return []

  if (isNavCollapsible(activeItem)) {
    return activeItem.items.map((item) => ({
      title: item.title,
      href: item.url,
      disabled: item.disabled,
    }))
  }

  return [
    {
      title: activeItem.title,
      href: activeItem.url,
      disabled: activeItem.disabled,
    },
  ]
}

function findActivePrimaryItem(sidebarData: SidebarData, pathname: string) {
  const path = normalizePath(pathname)
  const candidates = sidebarData.navGroups.flatMap((group) => group.items)
  return candidates
    .filter((item) => isPrimaryItemMatch(path, item))
    .sort((a, b) => getPrimaryItemScore(b) - getPrimaryItemScore(a))[0]
}

function isPrimaryItemMatch(pathname: string, item: NavItem) {
  if (isNavCollapsible(item)) {
    return item.items.some((child) => isPathMatch(pathname, child.url))
  }

  return isPathMatch(pathname, item.url)
}

function getPrimaryItemScore(item: NavItem) {
  if (isNavCollapsible(item)) {
    return Math.max(
      ...item.items.map((child) => normalizePath(String(child.url)).length)
    )
  }

  return normalizePath(String(item.url)).length
}

function isNavCollapsible(item: NavItem): item is NavCollapsible {
  return 'items' in item && Array.isArray(item.items)
}

function normalizePath(path: string) {
  const cleanPath = path.split('?')[0] ?? '/'
  if (cleanPath === '/') return cleanPath
  return cleanPath.replace(/\/+$/, '')
}

function isPathMatch(pathname: string, url: NavLink['url']) {
  const target = normalizePath(String(url))
  if (target === '/') return pathname === '/'
  return pathname === target || pathname.startsWith(`${target}/`)
}
