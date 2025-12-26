/**
 * ImageUploadField - Composable image upload field
 *
 * A reusable component for uploading and previewing images.
 * Can be used for:
 * - Post cover images
 * - Profile avatars
 * - Project thumbnails
 *
 * Features:
 * - Drag and drop support
 * - Preview with remove option
 * - File type validation
 * - Customizable aspect ratio
 */
import { useCallback, useRef, useState } from 'react'
import { ImageIcon, UploadSimpleIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { cn } from '@/lib/utils'

interface ImageUploadFieldProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  onBlur?: () => void
  description?: string
  className?: string
  required?: boolean
  accept?: string
  maxSizeMB?: number
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto'
  errors?: Array<string>
}

export function ImageUploadField({
  label,
  value,
  onChange,
  onBlur,
  description,
  className,
  required,
  accept = 'image/*',
  maxSizeMB = 5,
  aspectRatio = 'square',
  errors = [],
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const hasError = errors.length > 0 || !!localError

  const handleFileSelect = useCallback(
    (file: File) => {
      setLocalError(null)

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setLocalError('Please select an image file')
        return
      }

      // Validate file size
      const sizeMB = file.size / (1024 * 1024)
      if (sizeMB > maxSizeMB) {
        setLocalError(`Image must be smaller than ${maxSizeMB}MB`)
        return
      }

      // Create preview URL
      const url = URL.createObjectURL(file)
      onChange(url)
    },
    [onChange, maxSizeMB],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0] as File | undefined
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const handleRemove = useCallback(() => {
    if (value) {
      URL.revokeObjectURL(value)
    }
    onChange(null)
    setLocalError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [value, onChange])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    auto: '',
  }[aspectRatio]

  return (
    <Field className={cn('w-full', className)}>
      <FieldLabel>
        {label}
        {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        onBlur={onBlur}
        className="sr-only"
        aria-label={label}
      />

      {value ? (
        // Preview state
        <div
          className={cn(
            'relative overflow-hidden rounded-lg w-full',
            aspectRatioClass,
          )}
        >
          <img
            src={value}
            alt="Upload preview"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
            >
              <UploadSimpleIcon className="size-4" />
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <XIcon className="size-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        // Upload state
        <button
          type="button"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-muted-foreground transition-colors w-full',
            aspectRatioClass,
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-input hover:border-primary/50 hover:bg-accent/50',
            hasError && 'border-destructive',
          )}
        >
          <ImageIcon className="size-10" weight="thin" />
          <div className="text-center text-sm">
            <span className="font-medium text-foreground">Click to upload</span>
            {' or drag and drop'}
          </div>
          <p className="text-xs">PNG, JPG, GIF up to {maxSizeMB}MB</p>
        </button>
      )}

      {(localError || hasError) && (
        <FieldError>{localError || errors.join(', ')}</FieldError>
      )}
    </Field>
  )
}
