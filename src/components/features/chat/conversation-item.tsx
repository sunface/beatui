import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type ChatConversationItemProps = {
  name: string
  preview: string
  avatar?: string
  avatarFallback: string
  selected?: boolean
  onClick?: () => void
}

export function ChatConversationItem({
  name,
  preview,
  avatar,
  avatarFallback,
  selected = false,
  onClick,
}: ChatConversationItemProps) {
  return (
    <button
      type='button'
      className={cn(
        'group hover:bg-accent hover:text-accent-foreground',
        'flex w-full rounded-md px-2 py-2 text-start text-sm',
        selected && 'sm:bg-muted'
      )}
      onClick={onClick}
    >
      <div className='flex gap-2'>
        <Avatar>
          <AvatarImage src={avatar} alt={avatarFallback} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <span className='col-start-2 row-span-2 font-medium'>{name}</span>
          <span className='col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground group-hover:text-accent-foreground/90'>
            {preview}
          </span>
        </div>
      </div>
    </button>
  )
}
