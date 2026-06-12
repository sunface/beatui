import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { MultiDeleteConfirmDialog } from '@/components/features/data-table'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  return (
    <MultiDeleteConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      table={table}
      entityName='user'
      onDelete={(rows) => {
        toast.promise(sleep(2000), {
          loading: 'Deleting users...',
          success: () => {
            table.resetRowSelection()
            return `Deleted ${rows.length} ${rows.length > 1 ? 'users' : 'user'}`
          },
          error: 'Error',
        })
      }}
    />
  )
}
