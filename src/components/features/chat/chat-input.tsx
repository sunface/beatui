import { useState } from 'react'
import { ImagePlus, Paperclip, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ChatInputProps = {
  onSend?: (message: string) => void
  placeholder?: string
}

export function ChatInput({
  onSend,
  placeholder = 'Type your messages...',
}: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = value.trim()
    if (!message) return
    onSend?.(message)
    setValue('')
  }

  return (
    <form
      data-component='chat-input'
      onSubmit={handleSubmit}
      className='flex w-full flex-none gap-2'
    >
      <div className='flex flex-1 items-center gap-2 rounded-md border border-input bg-card px-2 py-1 focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden lg:gap-4'>
        <div className='space-x-1'>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='h-8 rounded-md'
          >
            <Plus size={20} className='stroke-muted-foreground' />
          </Button>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='hidden h-8 rounded-md lg:inline-flex'
          >
            <ImagePlus size={20} className='stroke-muted-foreground' />
          </Button>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='hidden h-8 rounded-md lg:inline-flex'
          >
            <Paperclip size={20} className='stroke-muted-foreground' />
          </Button>
        </div>
        <label className='flex-1'>
          <span className='sr-only'>Chat Text Box</span>
          <input
            type='text'
            placeholder={placeholder}
            className='h-8 w-full bg-inherit focus-visible:outline-hidden'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
        <Button variant='ghost' size='icon' className='hidden sm:inline-flex'>
          <Send size={20} />
        </Button>
      </div>
      <Button className='h-full sm:hidden'>
        <Send size={18} /> Send
      </Button>
    </form>
  )
}
