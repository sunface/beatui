import { createFileRoute } from '@tanstack/react-router'
import { sidebarData } from '@/config/sidebar-data'
import { AuthenticatedLayout } from '@/components/features/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: () => <AuthenticatedLayout sidebarData={sidebarData} />,
})
