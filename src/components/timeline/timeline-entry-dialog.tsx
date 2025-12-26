'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPanel,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { LinksField } from '@/components/forms'
import type { TimelineEntryFormData } from '@/lib/types'
import { cn } from '@/lib/utils'

// Character limits for timeline entry fields
const TIMELINE_LIMITS = {
  title: { min: 3, max: 200 },
}

type DialogMode = 'add' | 'edit'

interface TimelineEntryDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when the dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Mode: 'add' for new entry, 'edit' for modifying existing */
  mode: DialogMode
  /** Initial values for edit mode */
  initialValues?: TimelineEntryFormData
  /** Callback on successful submit */
  onSubmit: (data: TimelineEntryFormData) => void
  /** Whether the form is submitting */
  isSubmitting?: boolean
}

const defaultValues: TimelineEntryFormData = {
  title: '',
  description: '',
  links: [],
}

export function TimelineEntryDialog({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
  isSubmitting = false,
}: TimelineEntryDialogProps) {
  const [formData, setFormData] = useState<TimelineEntryFormData>(
    initialValues ?? defaultValues,
  )
  const [errors, setErrors] = useState<{
    title?: string
    links?: string
  }>({})

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (open) {
      setFormData(initialValues ?? defaultValues)
      setErrors({})
    }
  }, [open, initialValues])

  const validateForm = useCallback((): boolean => {
    const newErrors: { title?: string; links?: string } = {}

    const trimmedTitle = formData.title.trim()
    if (!trimmedTitle) {
      newErrors.title = 'Title is required'
    } else if (trimmedTitle.length < TIMELINE_LIMITS.title.min) {
      newErrors.title = `Title must be at least ${TIMELINE_LIMITS.title.min} characters`
    }

    // Validate links - check for empty URLs and invalid URLs
    const hasEmptyLinks = formData.links.some((l) => !l.url.trim())
    if (hasEmptyLinks) {
      newErrors.links = 'All links must have valid URLs'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return
    onSubmit({
      title: formData.title.trim(),
      description: '', // Keep for API compatibility
      links: formData.links.filter((l) => l.url.trim()),
    })
  }, [formData, validateForm, onSubmit])

  const dialogTitle = mode === 'add' ? 'Add Update' : 'Edit Update'
  const dialogDescription =
    mode === 'add'
      ? 'Share a milestone or progress update on this project.'
      : 'Modify the details of this timeline entry.'
  const submitLabel = mode === 'add' ? 'Post Update' : 'Save Changes'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <Field invalid={!!errors.title} className="w-full">
            <FieldLabel>Update</FieldLabel>
            <div className="relative w-full">
              <Textarea
                placeholder="e.g. Released v1.0, Updated roadmap, Started development..."
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  if (e.target.value.length <= TIMELINE_LIMITS.title.max) {
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                }}
                rows={2}
                disabled={isSubmitting}
                maxLength={TIMELINE_LIMITS.title.max}
                variant={errors.title ? 'destructive' : 'default'}
                aria-invalid={!!errors.title}
                className={cn('pb-8 w-full')}
              />
              <div
                aria-live="polite"
                className="pointer-events-none absolute bottom-0 end-0 flex items-center justify-center p-3 text-muted-foreground text-xs tabular-nums"
                role="status"
              >
                {formData.title.length}/{TIMELINE_LIMITS.title.max}
              </div>
            </div>
            {errors.title && <FieldError>{errors.title}</FieldError>}
          </Field>

          <LinksField
            label="Links (optional)"
            value={formData.links}
            onChange={(links) => setFormData((prev) => ({ ...prev, links }))}
            maxLinks={3}
            urlPlaceholder="https://example.com/project"
            error={errors.links}
            showValidation={!!errors.links}
          />
        </DialogPanel>
        <DialogFooter variant="bare" className="sm:justify-stretch">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto sm:flex-1"
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}
