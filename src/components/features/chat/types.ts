/**
 * Minimal scenario contract for the chat components. Project data models
 * map into these shapes at the page level; anything richer (status,
 * attachments, reactions…) belongs to the consuming project.
 */
export type ChatMessage = {
  /** Sender key — compared by the page-level `isOwn` predicate. */
  sender: string
  message: string
  timestamp: string | Date
}
