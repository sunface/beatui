import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type AppCardProps = {
  logo: React.ReactNode
  name: string
  description: string
  connected?: boolean
  onConnect?: () => void
  className?: string
}

export function AppCard({
  logo,
  name,
  description,
  connected = false,
  onConnect,
  className,
}: AppCardProps) {
  return (
    <div className={cn('rounded-lg border p-4 hover:shadow-md', className)}>
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex size-10 items-center justify-center rounded-lg bg-muted p-2'>
          {logo}
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={onConnect}
          className={cn(
            connected &&
              'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900'
          )}
        >
          {connected ? 'Connected' : 'Connect'}
        </Button>
      </div>
      <div>
        <h2 className='mb-1 font-semibold'>{name}</h2>
        <p className='line-clamp-2 text-muted-foreground'>{description}</p>
      </div>
    </div>
  )
}
