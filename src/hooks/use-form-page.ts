/**
 * useFormPage - Shared logic for form pages
 *
 * Handles:
 * - Form submission state
 * - Dirty state tracking
 * - Rate limiting
 * - Navigation blocking
 */
import { useRef, useState, useCallback } from 'react'
import { useBlocker } from '@tanstack/react-router'
import { toastManager } from '@/components/ui/toast'

interface UseFormPageOptions<T> {
  /** Called when form is submitted */
  onSubmit: (data: T) => Promise<void>
  /** Called when submission fails */
  onError?: (error: unknown) => void
  /** Cooldown between submissions in ms (default: 2000) */
  submitCooldown?: number
  /** Toast messages */
  messages?: {
    rateLimited?: {
      title?: string
      description?: string
    }
  }
}

export function useFormPage<T>(options: UseFormPageOptions<T>) {
  const { onSubmit, onError, submitCooldown = 2000, messages } = options

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const lastSubmitTime = useRef<number>(0)
  const isSubmittingRef = useRef(false)

  // Block navigation when form is dirty
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => isDirty,
    withResolver: true,
    enableBeforeUnload: true,
  })

  const handleDirtyChange = useCallback((dirty: boolean) => {
    setIsDirty(dirty)
  }, [])

  const handleSubmit = useCallback(
    async (data: T) => {
      // Prevent double submissions
      if (isSubmittingRef.current) return
      isSubmittingRef.current = true

      // Rate limiting
      const now = Date.now()
      if (now - lastSubmitTime.current < submitCooldown) {
        toastManager.add({
          type: 'warning',
          title: messages?.rateLimited?.title ?? 'Slow down',
          description:
            messages?.rateLimited?.description ??
            'Please wait a moment before trying again.',
          timeout: 2500,
        })
        isSubmittingRef.current = false
        return
      }
      lastSubmitTime.current = now

      setIsSubmitting(true)
      try {
        await onSubmit(data)
      } catch (error) {
        onError?.(error)
        if (import.meta.env.DEV) {
          console.error('Form submission error:', error)
        }
      } finally {
        setIsSubmitting(false)
        isSubmittingRef.current = false
      }
    },
    [onSubmit, onError, submitCooldown, messages],
  )

  const triggerSubmit = useCallback(() => {
    if (formRef.current && !isSubmitting) {
      formRef.current.requestSubmit()
    }
  }, [isSubmitting])

  return {
    formRef,
    isSubmitting,
    isDirty,
    handleDirtyChange,
    handleSubmit,
    triggerSubmit,
    // Blocker state
    blocker: {
      status,
      proceed: () => proceed?.(),
      reset: () => reset?.(),
    },
  }
}
