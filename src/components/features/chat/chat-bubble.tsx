import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { type ChatMessage } from './types'

type ChatBubbleProps = {
  message: ChatMessage
  isOwn: boolean
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        'max-w-72 px-3 py-2 break-words shadow-lg',
        isOwn
          ? 'self-end rounded-[16px_16px_0_16px] bg-primary/90 text-primary-foreground/75'
          : 'self-start rounded-[16px_16px_16px_0] bg-muted'
      )}
    >
      {message.message}{' '}
      <span
        className={cn(
          'mt-1 block text-xs font-light text-foreground/75 italic',
          isOwn && 'text-end text-primary-foreground/85'
        )}
      >
        {format(message.timestamp, 'h:mm a')}
      </span>
    </div>
  )
}
