import { Telescope } from 'lucide-react'
import { cn } from '@/lib/utils'

type ComingSoonProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: React.ReactNode
}

export function ComingSoon({
  title = 'Coming Soon!',
  description = (
    <>
      This page has not been created yet. <br />
      Stay tuned though!
    </>
  ),
  className,
  ...props
}: ComingSoonProps) {
  return (
    <div
      data-component='coming-soon'
      className={cn(
        'flex min-h-[20rem] w-full items-center justify-center px-4 py-16',
        className
      )}
      {...props}
    >
      <div className='flex max-w-md flex-col items-center justify-center gap-2 text-center'>
        <Telescope size={72} />
        <h1 className='text-4xl leading-tight font-bold'>{title}</h1>
        <p className='text-muted-foreground'>{description}</p>
      </div>
    </div>
  )
}
