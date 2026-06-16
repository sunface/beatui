import { type conversations } from './convo'

export type ChatUser = (typeof conversations)[number]
export type Convo = ChatUser['messages'][number]
