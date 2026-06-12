import { createFileRoute } from '@tanstack/react-router'
import { SettingsNotifications } from '@/demo/settings-forms/notifications'

export const Route = createFileRoute('/_authenticated/settings/notifications')({
  component: SettingsNotifications,
})
