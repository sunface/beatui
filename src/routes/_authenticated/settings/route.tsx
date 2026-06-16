import { createFileRoute } from '@tanstack/react-router'
import { SettingsLayout } from '@/components/features/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsLayout,
})
