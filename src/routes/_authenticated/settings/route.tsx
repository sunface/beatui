import { createFileRoute } from '@tanstack/react-router'
import { Monitor, Bell, Palette, Wrench, UserCog } from 'lucide-react'
import {
  SettingsLayout,
  type SettingsNavItem,
} from '@/components/features/settings'

const sidebarNavItems: SettingsNavItem[] = [
  {
    title: 'Profile',
    href: '/settings',
    icon: <UserCog size={18} />,
  },
  {
    title: 'Account',
    href: '/settings/account',
    icon: <Wrench size={18} />,
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: <Palette size={18} />,
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    icon: <Bell size={18} />,
  },
  {
    title: 'Display',
    href: '/settings/display',
    icon: <Monitor size={18} />,
  },
]

export const Route = createFileRoute('/_authenticated/settings')({
  component: () => <SettingsLayout items={sidebarNavItems} />,
})
