import { createFileRoute } from '@tanstack/react-router'
import { Otp } from '@/components/features/auth/otp'

export const Route = createFileRoute('/(auth)/otp')({
  component: Otp,
})
