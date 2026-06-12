import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '@/components/features/auth/forgot-password'

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPassword,
})
