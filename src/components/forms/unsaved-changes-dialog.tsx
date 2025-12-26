/**
 * UnsavedChangesDialog - Reusable confirmation dialog for unsaved changes
 *
 * Used with TanStack Router's useBlocker to show a confirmation before navigation
 * when a form has unsaved changes.
 */
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface UnsavedChangesDialogProps {
  /** Whether the dialog is open (typically status === 'blocked') */
  open: boolean
  /** Called when user wants to keep editing */
  onKeepEditing: () => void
  /** Called when user confirms discarding changes */
  onDiscard: () => void
  /** Custom title (optional) */
  title?: string
  /** Custom description (optional) */
  description?: string
  /** Keep editing button text (optional) */
  keepEditingText?: string
  /** Discard button text (optional) */
  discardText?: string
}

export function UnsavedChangesDialog({
  open,
  onKeepEditing,
  onDiscard,
  title = 'Discard changes?',
  description = 'You have unsaved changes. Are you sure you want to leave? Your changes will not be saved.',
  keepEditingText = 'Keep editing',
  discardText = 'Discard',
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => onKeepEditing()}>
      <DialogPopup showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter variant="bare">
          <Button variant="outline" onClick={onKeepEditing}>
            {keepEditingText}
          </Button>
          <Button variant="destructive" onClick={onDiscard}>
            {discardText}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}
