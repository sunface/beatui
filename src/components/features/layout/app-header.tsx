import { useLocation } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/features/config-drawer'
import { Search } from '@/components/features/search'
import { ThemeSwitch } from '@/components/features/theme-switch'
import { getSectionNavItems } from '@/config/sidebar-data'
import { Header, type HeaderProps } from './header'
import { SectionTopNav } from './section-top-nav'

type AppHeaderProps = HeaderProps

export function AppHeader(props: AppHeaderProps) {
  const pathname = useLocation({ select: (location) => location.pathname })
  const navItems = getSectionNavItems(pathname)

  return (
    <Header {...props}>
      <SectionTopNav items={navItems} className='me-auto' />
      <Search />
      <ThemeSwitch />
      <ConfigDrawer />
    </Header>
  )
}
