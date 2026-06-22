import { useContext } from 'react'
import { ConfigDrawer } from '@/components/features/config-drawer'
import { Search } from '@/components/features/search'
import { ThemeSwitch } from '@/components/features/theme-switch'
import { Header, type HeaderProps } from './header'
import { SectionNavItemsContext } from './section-nav-context'
import { SectionTopNav, type SectionNavItem } from './section-top-nav'

type AppHeaderProps = HeaderProps & {
  navItems?: SectionNavItem[]
}

export function AppHeader({
  fixed = true,
  navItems,
  ...props
}: AppHeaderProps) {
  const contextNavItems = useContext(SectionNavItemsContext)
  const items = navItems ?? contextNavItems

  return (
    <Header fixed={fixed} {...props}>
      <SectionTopNav items={items} className='me-auto' />
      <Search />
      <ThemeSwitch />
      <ConfigDrawer />
    </Header>
  )
}
