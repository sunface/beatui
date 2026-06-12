import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/features/config-drawer'
import { ForbiddenError } from '@/components/features/errors/forbidden'
import { GeneralError } from '@/components/features/errors/general-error'
import { MaintenanceError } from '@/components/features/errors/maintenance-error'
import { NotFoundError } from '@/components/features/errors/not-found-error'
import { UnauthorisedError } from '@/components/features/errors/unauthorized-error'
import { Header } from '@/components/features/layout/header'
import { ProfileDropdown } from '@/components/features/profile-dropdown'
import { Search } from '@/components/features/search'
import { ThemeSwitch } from '@/components/features/theme-switch'

export const Route = createFileRoute('/_authenticated/errors/$error')({
  component: RouteComponent,
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { error } = Route.useParams()

  const errorMap: Record<string, React.ComponentType> = {
    unauthorized: UnauthorisedError,
    forbidden: ForbiddenError,
    'not-found': NotFoundError,
    'internal-server-error': GeneralError,
    'maintenance-error': MaintenanceError,
  }
  const ErrorComponent = errorMap[error] || NotFoundError

  return (
    <>
      <Header fixed className='border-b'>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <div className='flex-1 [&>div]:h-full'>
        <ErrorComponent />
      </div>
    </>
  )
}
