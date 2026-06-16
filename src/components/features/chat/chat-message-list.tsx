import { Fragment } from 'react'
import { format } from 'date-fns'
import { ChatBubble } from './chat-bubble'
import { type ChatMessage } from './types'

type ChatMessageListProps = {
  /** Newest first — the column-reverse container keeps the view pinned to the latest message. */
  messages: ChatMessage[]
  isOwn: (message: ChatMessage) => boolean
}

export function ChatMessageList({ messages, isOwn }: ChatMessageListProps) {
  const messagesByDay = messages.reduce<Record<string, ChatMessage[]>>(
    (acc, message) => {
      const key = format(message.timestamp, 'd MMM, yyyy')
      ;(acc[key] ??= []).push(message)
      return acc
    },
    {}
  )

  return (
    <div data-component='chat-message-list' className='flex size-full flex-1'>
      <div className='relative -me-4 flex flex-1 flex-col overflow-y-hidden'>
        <div className='flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4'>
          {Object.keys(messagesByDay).map((day) => (
            <Fragment key={day}>
              {messagesByDay[day].map((message, index) => (
                <ChatBubble
                  key={`${message.sender}-${message.timestamp}-${index}`}
                  message={message}
                  isOwn={isOwn(message)}
                />
              ))}
              <div className='text-center text-xs'>{day}</div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
