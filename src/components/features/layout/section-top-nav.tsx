import { useMemo, type ComponentProps } from 'react'
import { useLocation } from '@tanstack/react-router'
import { TopNav } from './top-nav'

export type SectionNavItem = {
  title: string
  href: string
  disabled?: boolean
}

type SectionTopNavProps = Omit<ComponentProps<typeof TopNav>, 'links'> & {
  items: SectionNavItem[]
}

export function SectionTopNav({ items, ...props }: SectionTopNavProps) {
  const { pathname } = useLocation()
  const activeHref = useMemo(
    () => getActiveHref(pathname, items),
    [items, pathname]
  )
  const links = useMemo(
    () =>
      items.map((item) => ({
        title: item.title,
        href: item.href,
        disabled: item.disabled,
        isActive: normalizePath(item.href) === activeHref,
      })),
    [activeHref, items]
  )

  return <TopNav links={links} {...props} />
}

function getActiveHref(pathname: string, items: SectionNavItem[]) {
  const currentPath = normalizePath(pathname)
  const matches = items
    .map((item) => normalizePath(item.href))
    .filter((href) => isPathMatch(currentPath, href))
    .sort((a, b) => b.length - a.length)

  return matches[0] ?? normalizePath(items[0]?.href ?? '/')
}

function isPathMatch(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function normalizePath(path: string) {
  if (path === '/') return path
  return path.replace(/\/+$/, '')
}
