import { createFileRoute } from '@tanstack/react-router'
import { ForbiddenError } from '@/components/features/errors/forbidden'

export const Route = createFileRoute('/(errors)/403')({
  component: ForbiddenError,
})
