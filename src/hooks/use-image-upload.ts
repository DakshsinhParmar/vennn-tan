/**
 * useImageUpload Hook
 *
 * Central image upload logic for both single and multi-image uploads.
 * Handles validation, file processing, and state management.
 *
 * Features:
 * - File type validation (JPEG, PNG, WebP)
 * - File size validation (configurable max size)
 * - Drag and drop support
 * - Object URL management with cleanup
 * - Error handling
 */
import { useCallback, useRef, useState } from 'react'

export interface ImageFile {
  id: string
  url: string
  file: File
  name: string
}

export interface UseImageUploadOptions {
  /** Maximum file size in MB. Default: 5 */
  maxSizeMB?: number
  /** Maximum number of images (for multi-upload). Default: 1 */
  maxImages?: number
  /** Accepted file types. Default: JPEG, PNG, WebP */
  acceptedTypes?: Array<string>
}

export interface UseImageUploadReturn {
  /** Reference to attach to file input */
  inputRef: React.RefObject<HTMLInputElement | null>
  /** Whether user is dragging over the drop zone */
  isDragging: boolean
  /** Current error message, if any */
  error: string | null
  /** Trigger file input click */
  openFilePicker: () => void
  /** Handle file input change */
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Handle drag over event */
  handleDragOver: (e: React.DragEvent) => void
  /** Handle drag leave event */
  handleDragLeave: (e: React.DragEvent) => void
  /** Handle drop event */
  handleDrop: (e: React.DragEvent) => void
  /** Clear error state */
  clearError: () => void
  /** Validate a single file */
  validateFile: (file: File) => string | null
  /** Get accepted file types as input accept string */
  acceptString: string
  /** Formatted accepted types for display */
  formattedTypes: string
  /** Max size in MB */
  maxSizeMB: number
}

const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const DEFAULT_MAX_SIZE_MB = 5

/**
 * Generate a unique ID for image files
 */
function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Format file types for display (e.g., "JPEG, PNG, WebP")
 */
function formatTypes(types: Array<string>): string {
  return types
    .map((type) => type.replace('image/', '').toUpperCase())
    .join(', ')
}

/**
 * Convert MIME types to accept string (e.g., ".jpg,.jpeg,.png,.webp")
 */
function typesToAcceptString(types: Array<string>): string {
  const extensions: Record<string, string> = {
    'image/jpeg': '.jpg,.jpeg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  }
  return types.map((type) => extensions[type] || type).join(',')
}

export function useImageUpload(
  options: UseImageUploadOptions = {},
): UseImageUploadReturn {
  const {
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  } = options

  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const acceptString = typesToAcceptString(acceptedTypes)
  const formattedTypes = formatTypes(acceptedTypes)

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        return `Only ${formattedTypes} files allowed`
      }

      // Check file size
      const sizeMB = file.size / (1024 * 1024)
      if (sizeMB > maxSizeMB) {
        return `File too big (max ${maxSizeMB}MB)`
      }

      return null
    },
    [acceptedTypes, formattedTypes, maxSizeMB],
  )

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>) => {
      // Reset error on new selection
      setError(null)
    },
    [],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    inputRef,
    isDragging,
    error,
    openFilePicker,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearError,
    validateFile,
    acceptString,
    formattedTypes,
    maxSizeMB,
  }
}

/**
 * Helper to create object URL and track for cleanup
 */
export function createImageFile(file: File): ImageFile {
  return {
    id: generateId(),
    url: URL.createObjectURL(file),
    file,
    name: file.name,
  }
}

/**
 * Helper to revoke object URL
 */
export function revokeImageUrl(url: string): void {
  URL.revokeObjectURL(url)
}
