import { Outlet } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { AppHeader } from '@/components/features/layout/app-header'
import { Main } from '@/components/features/layout/main'

export function SettingsLayout() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <AppHeader />

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div
          data-component='settings-layout'
          className='flex min-h-0 flex-1 overflow-hidden'
        >
          <div className='flex w-full overflow-y-hidden p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}
