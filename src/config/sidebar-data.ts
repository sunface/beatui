import {
  Construction,
  LayoutDashboard,
  MessagesSquare,
  Monitor,
  Package,
  Bug,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import type { SectionNavItem } from '@/components/features/layout/section-top-nav'
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type SidebarData,
} from '@/components/features/layout/types'

export const sidebarData: SidebarData = {
  user: {
    name: 'admin',
    email: 'admin@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'BeatUI',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Chats',
          url: '/chats',
          icon: MessagesSquare,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}

export function getSectionNavItems(pathname: string): SectionNavItem[] {
  const activeItem =
    findActivePrimaryItem(pathname) ?? sidebarData.navGroups[0]?.items[0]
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

function findActivePrimaryItem(pathname: string) {
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
      ...item.items.map((child) => normalizePath(child.url).length)
    )
  }

  return normalizePath(item.url).length
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
