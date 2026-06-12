import { createFileRoute } from '@tanstack/react-router'
import { Monitor, Palette } from 'lucide-react'
import {
  SettingsLayout,
  type SettingsNavItem,
} from '@/components/features/settings'

const sidebarNavItems: SettingsNavItem[] = [
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: <Palette size={18} />,
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
