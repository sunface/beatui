import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/demo/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
})
