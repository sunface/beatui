import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/features/coming-soon'
import { AppHeader } from '@/components/features/layout/app-header'
import { Main } from '@/components/features/layout/main'

export const Route = createFileRoute('/_authenticated/help-center/')({
  component: () => (
    <>
      <AppHeader />
      <Main fixed className='flex flex-1'>
        <ComingSoon className='flex-1' />
      </Main>
    </>
  ),
})
