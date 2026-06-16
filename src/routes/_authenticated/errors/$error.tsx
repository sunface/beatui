import { createFileRoute } from '@tanstack/react-router'
import { ForbiddenError } from '@/components/features/errors/forbidden'
import { GeneralError } from '@/components/features/errors/general-error'
import { MaintenanceError } from '@/components/features/errors/maintenance-error'
import { NotFoundError } from '@/components/features/errors/not-found-error'
import { UnauthorisedError } from '@/components/features/errors/unauthorized-error'
import { AppHeader } from '@/components/features/layout/app-header'

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
      <AppHeader fixed className='border-b' />
      <div className='flex-1 [&>div]:h-full'>
        <ErrorComponent />
      </div>
    </>
  )
}
