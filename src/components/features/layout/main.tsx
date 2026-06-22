import { cn } from '@/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Main({
  fixed = true,
  className,
  fluid = true,
  ...props
}: MainProps) {
  return (
    <main
      data-component='main'
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'ps-3 pe-3 pt-2 pb-2',

        // If layout is fixed, make the main container flex and grow
        fixed && 'flex min-h-0 grow flex-col overflow-x-hidden overflow-y-auto',

        // If layout is not fluid, set the max-width
        !fluid &&
          '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl',
        className
      )}
      {...props}
    />
  )
}
