import { createFileRoute } from '@tanstack/react-router'
import { SettingsAccount } from '@/demo/settings-forms/account'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccount,
})
