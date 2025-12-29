/**
 * MultiImageUpload - Full-width image gallery for posts
 *
 * Supports up to 6 images with a clean, integrated design.
 * Large upload area when empty, grid of thumbnails when images are added.
 */
import { useCallback, useState } from 'react'
import { ImagesIcon, PlusIcon, XIcon } from '@phosphor-icons/react'
import type { ImageFile } from '@/hooks/use-image-upload'
import { Field, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { text, spacing } from '@/lib/design'
import {
  createImageFile,
  revokeImageUrl,
  useImageUpload,
} from '@/hooks/use-image-upload'

interface MultiImageUploadProps {
  /** Field label text */
  label?: string
  /** Helper description text */
  description?: string
  /** Array of image URLs */
  value: Array<string>
  /** Callback when images change */
  onChange: (urls: Array<string>) => void
  /** Blur handler for form validation */
  onBlur?: () => void
  /** Additional CSS classes */
  className?: string
  /** Maximum number of images allowed */
  maxImages?: number
  /** Validation error messages */
  errors?: Array<string>
}

export function MultiImageUpload({
  label = 'Images',
  description,
  value = [],
  onChange,
  onBlur,
  className,
  maxImages = 6,
  errors = [],
}: MultiImageUploadProps) {
  const [internalError, setInternalError] = useState<string | null>(null)

  const {
    inputRef,
    isDragging,
    openFilePicker,
    handleDragOver,
    handleDragLeave,
    validateFile,
    acceptString,
  } = useImageUpload({
    maxSizeMB: 5,
    maxImages,
  })

  const hasError = errors.length > 0 || !!internalError
  const displayError = internalError ?? errors[0]
  const canAddMore = value.length < maxImages
  const hasImages = value.length > 0

  const handleFilesSelect = useCallback(
    async (files: Array<File> | FileList) => {
      setInternalError(null)
      const fileArray = Array.from(files)
      const availableSlots = maxImages - value.length

      if (fileArray.length > availableSlots) {
        setInternalError(
          `Only ${availableSlots} more image${availableSlots === 1 ? '' : 's'} allowed`,
        )
        return
      }

      // Convert existing URLs to data for comparison
      const existingDataUrls = await Promise.all(
        value.map(async (url) => {
          try {
            const response = await fetch(url)
            const blob = await response.blob()
            return new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            })
          } catch {
            return url
          }
        }),
      )

      const validFiles: Array<string> = []
      for (const file of fileArray) {
        const validationError = validateFile(file)
        if (validationError) {
          setInternalError(validationError)
          return
        }

        // Check for duplicates by comparing file data
        const fileDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })

        if (existingDataUrls.includes(fileDataUrl)) {
          setInternalError('Image already added')
          return
        }

        const imageFile = createImageFile(file)
        validFiles.push(imageFile.url)
      }

      onChange([...value, ...validFiles])
    },
    [validateFile, value, onChange, maxImages],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) handleFilesSelect(files)
      e.target.value = ''
    },
    [handleFilesSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const files = e.dataTransfer.files
      if (files.length > 0) handleFilesSelect(files)
    },
    [handleFilesSelect],
  )

  const handleRemove = useCallback(
    (index: number) => {
      const urlToRemove = value[index]
      if (urlToRemove) revokeImageUrl(urlToRemove)
      onChange(value.filter((_, i) => i !== index))
      setInternalError(null)
    },
    [value, onChange],
  )

  return (
    <Field className={cn('w-full', className)}>
      {label && (
        <FieldLabel className={cn(hasError && 'text-destructive')}>
          {label}
        </FieldLabel>
      )}
      {description && (
        <p className={`${text.smMuted} -mt-1 mb-2`}>{description}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
        onChange={handleInputChange}
        onBlur={onBlur}
        className="sr-only"
        aria-label={label}
        multiple
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn('w-full', isDragging && 'opacity-70')}
      >
        {/* Empty state - Large upload area */}
        {!hasImages && (
          <button
            type="button"
            onClick={openFilePicker}
            className={cn(
              'w-full flex flex-col items-center justify-center py-12 px-4 rounded-xl transition-all',
              'bg-muted/50 border-2 border-dashed border-muted-foreground/20',
              'hover:bg-muted hover:border-muted-foreground/40',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragging && 'border-primary bg-primary/5',
              hasError && 'border-destructive',
            )}
          >
            <ImagesIcon
              className="size-10 text-muted-foreground mb-3"
              weight="light"
            />
            <span className={`text-sm font-medium text-muted-foreground`}>
              Click to upload or drag and drop
            </span>
            <span className={`text-xs text-muted-foreground/60 mt-1`}>
              JPEG, PNG, WEBP up to 5MB each
            </span>
          </button>
        )}

        {/* Images grid */}
        {hasImages && (
          <div className={spacing.stack.sm}>
            <div className="grid grid-cols-3 gap-2">
              {/* Uploaded images */}
              {value.map((url, index) => (
                <div
                  key={url}
                  className="relative aspect-square rounded-xl overflow-hidden bg-muted group"
                >
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className={cn(
                      'absolute top-1.5 right-1.5 flex items-center justify-center',
                      'size-7 rounded-full bg-black/60 text-white',
                      'sm:opacity-0 sm:group-hover:opacity-100 transition-opacity',
                      'hover:bg-destructive',
                    )}
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <XIcon className="size-4" weight="bold" />
                  </button>
                </div>
              ))}

              {/* Add more button - only when not at max */}
              {canAddMore && (
                <button
                  type="button"
                  onClick={openFilePicker}
                  className={cn(
                    'flex flex-col items-center justify-center aspect-square rounded-xl transition-all',
                    'bg-muted/50 border-2 border-dashed border-muted-foreground/20',
                    'hover:bg-muted hover:border-muted-foreground/40',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isDragging && 'border-primary bg-primary/5',
                  )}
                >
                  <PlusIcon className="size-6 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Counter */}
            <div className={`flex justify-between items-center`}>
              <span className={text.xsMuted}>
                {value.length} of {maxImages} images
              </span>
              {canAddMore && (
                <button
                  type="button"
                  onClick={openFilePicker}
                  className={`text-sm font-medium text-primary hover:underline`}
                >
                  Add more
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {hasError && displayError && (
        <p className="text-sm text-destructive" role="alert">
          {displayError}
        </p>
      )}
    </Field>
  )
}

export type { ImageFile }
