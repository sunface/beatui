import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/features/config-drawer'
import { Header } from '@/components/features/layout/header'
import { Main } from '@/components/features/layout/main'
import { ProfileDropdown } from '@/components/features/profile-dropdown'
import { Search } from '@/components/features/search'
import { ThemeSwitch } from '@/components/features/theme-switch'

export const Route = createFileRoute('/_authenticated/')({
  component: Home,
})

// eslint-disable-next-line react-refresh/only-export-components -- route files export Route alongside the local page component
function Home() {
  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Start building your pages here.
        </p>
      </Main>
    </>
  )
}
