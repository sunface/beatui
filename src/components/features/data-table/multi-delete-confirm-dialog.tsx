'use client'

import { useId, useState } from 'react'
import { type Row, type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/features/confirm-dialog'

type MultiDeleteConfirmDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
  /** Entity name in singular form, e.g. 'user'. Used in the generated copy. */
  entityName: string
  /** Defaults to `${entityName}s`. */
  entityNamePlural?: string
  /** The word the user must type to enable deletion. Defaults to 'DELETE'. */
  confirmWord?: string
  /** Called with the selected rows once the confirm word is matched. */
  onDelete: (rows: Row<TData>[]) => void
}

export function MultiDeleteConfirmDialog<TData>({
  open,
  onOpenChange,
  table,
  entityName,
  entityNamePlural = `${entityName}s`,
  confirmWord = 'DELETE',
  onDelete,
}: MultiDeleteConfirmDialogProps<TData>) {
  const formId = useId()
  const [value, setValue] = useState('')

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const entityLabel = selectedRows.length > 1 ? entityNamePlural : entityName

  const handleDelete = () => {
    if (value.trim() !== confirmWord) {
      toast.error(`Please type "${confirmWord}" to confirm.`)
      return
    }

    onOpenChange(false)
    setValue('')
    onDelete(selectedRows)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form={formId}
      disabled={value.trim() !== confirmWord}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length} {entityLabel}
        </span>
      }
      desc={
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to delete the selected {entityNamePlural}?{' '}
            <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>Confirm by typing "{confirmWord}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${confirmWord}" to confirm.`}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText='Delete'
      destructive
    />
  )
}
