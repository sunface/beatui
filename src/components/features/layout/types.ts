import { type LinkProps } from '@tanstack/react-router'

type NavUrl = NonNullable<LinkProps['to']> | (string & {})

type User = {
  name: string
  email: string
  avatar: string
}

type Team = {
  name: string
  logo: React.ElementType
  plan: string
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
  disabled?: boolean
}

type NavLink = BaseNavItem & {
  url: NavUrl
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: NavUrl })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
}

type SidebarData = {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink, NavUrl }
