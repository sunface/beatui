import { Outlet } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/features/config-drawer'
import { Header } from '@/components/features/layout/header'
import { Main } from '@/components/features/layout/main'
import { Search } from '@/components/features/search'
import { ThemeSwitch } from '@/components/features/theme-switch'
import { SidebarNav, type SettingsNavItem } from './sidebar-nav'

type SettingsLayoutProps = {
  /** Section entries shown in the settings sidebar; wired by the route. */
  items: SettingsNavItem[]
}

export function SettingsLayout({ items }: SettingsLayoutProps) {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div
          data-component='settings-layout'
          className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'
        >
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={items} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}
