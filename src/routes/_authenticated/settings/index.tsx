import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from '@/demo/settings-forms/profile'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsProfile,
})
