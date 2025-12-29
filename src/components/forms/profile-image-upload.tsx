/**
 * ProfileImageUpload - Circular profile photo uploader
 *
 * Matches the profile page avatar style - circular, same size (96px).
 * Mobile-responsive: stacks vertically on mobile, horizontal on desktop.
 */
import { useCallback } from 'react'
import { TrashIcon, UploadSimpleIcon, UserIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { text } from '@/lib/design'
import {
  createImageFile,
  revokeImageUrl,
  useImageUpload,
} from '@/hooks/use-image-upload'

interface ProfileImageUploadProps {
  /** Field label text */
  label?: string
  /** Current image URL or null */
  value: string | null
  /** Callback when image changes */
  onChange: (url: string | null) => void
  /** Blur handler for form validation */
  onBlur?: () => void
  /** Additional CSS classes */
  className?: string
  /** Validation error messages */
  errors?: Array<string>
}

export function ProfileImageUpload({
  label = 'Profile Photo',
  value,
  onChange,
  onBlur,
  className,
  errors = [],
}: ProfileImageUploadProps) {
  const {
    inputRef,
    isDragging,
    error: uploadError,
    openFilePicker,
    handleDragOver,
    handleDragLeave,
    validateFile,
    acceptString,
  } = useImageUpload({
    maxSizeMB: 5,
    maxImages: 1,
  })

  const hasError = errors.length > 0 || !!uploadError
  const displayError = uploadError ?? errors[0]

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) return

      if (value) revokeImageUrl(value)
      const imageFile = createImageFile(file)
      onChange(imageFile.url)
    },
    [validateFile, value, onChange],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileSelect(file)
      e.target.value = ''
    },
    [handleFileSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const file = e.dataTransfer.files[0] as File | undefined
      if (file) handleFileSelect(file)
    },
    [handleFileSelect],
  )

  const handleRemove = useCallback(() => {
    if (value) revokeImageUrl(value)
    onChange(null)
  }, [value, onChange])

  return (
    <Field className={cn('w-full', className)}>
      {label && (
        <FieldLabel className={cn(hasError && 'text-destructive')}>
          {label}
        </FieldLabel>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
        onChange={handleInputChange}
        onBlur={onBlur}
        className="sr-only"
        aria-label={label}
      />

      {/* Mobile: vertical stack, Desktop: horizontal */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'w-full flex flex-col items-center gap-4',
          'sm:flex-row sm:items-center sm:justify-between',
          isDragging && 'opacity-70',
        )}
      >
        {/* Avatar + Info - centered on mobile */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          {/* Circular avatar - matches profile page size (80px) */}
          <button
            type="button"
            onClick={openFilePicker}
            className={cn(
              'relative flex items-center justify-center shrink-0',
              'size-20 rounded-full overflow-hidden',
              'bg-muted transition-all',
              'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragging && 'ring-2 ring-primary ring-offset-2',
              hasError && 'ring-2 ring-destructive ring-offset-2',
            )}
          >
            {value ? (
              <>
                <img
                  src={value}
                  alt="Profile preview"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <UploadSimpleIcon
                    className="size-6 text-white"
                    weight="bold"
                  />
                </div>
              </>
            ) : (
              <UserIcon
                className="size-10 text-muted-foreground"
                weight="light"
              />
            )}
          </button>

          {/* Info text - centered on mobile */}
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className={`text-sm font-medium`}>
              {value ? 'Click to change' : 'Upload a photo'}
            </span>
            <span className={text.xsMuted}>JPEG, PNG, WEBP • Max 5MB</span>
          </div>
        </div>

        {/* Actions - full width on mobile, symmetrical buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={openFilePicker}
            className="flex-1 sm:flex-none"
          >
            {value ? 'Change' : 'Upload'}
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-1 sm:flex-none"
            >
              <TrashIcon className="size-5" />
              <span className="sm:hidden">Remove</span>
            </Button>
          )}
        </div>
      </div>

      {hasError && displayError && (
        <p className="text-sm text-destructive" role="alert">
          {displayError}
        </p>
      )}
    </Field>
  )
}
