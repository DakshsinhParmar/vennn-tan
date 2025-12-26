import { useCallback, useEffect, useRef } from 'react'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Constants
const SEARCH_LIMITS = {
  maxLength: 100,
  minLength: 1,
} as const

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  inputClassName?: string
  showIcon?: boolean
  size?: 'sm' | 'default' | 'lg'
  'aria-label'?: string
}

/**
 * SearchInput - Production-grade search input component
 *
 * Features:
 * - Input sanitization (strips dangerous chars)
 * - Max length enforcement
 * - Clear button with keyboard support
 * - Optional search icon
 * - Accessible with ARIA labels
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  autoFocus = false,
  className,
  inputClassName,
  showIcon = false,
  size = 'default',
  'aria-label': ariaLabel = 'Search',
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Sanitize input - remove potentially dangerous characters
  const sanitizeValue = useCallback((input: string): string => {
    // Remove zero-width chars and control characters via char code filtering
    return input
      .split('')
      .filter((char) => {
        const code = char.charCodeAt(0)
        // Allow printable ASCII and common Unicode, filter control chars and zero-width
        const isControlChar = code < 32 || code === 127
        const isZeroWidth =
          (code >= 0x200b && code <= 0x200d) ||
          code === 0xfeff ||
          code === 0x00ad
        return !isControlChar && !isZeroWidth
      })
      .join('')
      .slice(0, SEARCH_LIMITS.maxLength)
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeValue(e.target.value)
      onChange(sanitized)
    },
    [onChange, sanitizeValue],
  )

  const handleClear = useCallback(() => {
    onChange('')
    inputRef.current?.focus()
  }, [onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Clear on Escape when input has value
      if (e.key === 'Escape' && value) {
        e.preventDefault()
        handleClear()
      }
    },
    [value, handleClear],
  )

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus) {
      // Small delay to ensure DOM is ready
      const timeout = setTimeout(() => inputRef.current?.focus(), 0)
      return () => clearTimeout(timeout)
    }
  }, [autoFocus])

  const iconSize = size === 'sm' ? 'size-3.5' : 'size-4'
  const clearBtnSize = size === 'sm' ? 'icon-xs' : 'icon-sm'

  return (
    <div className={cn('relative flex-1', className)}>
      {showIcon && (
        <MagnifyingGlassIcon
          className={cn(
            iconSize,
            'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none',
          )}
          weight="bold"
        />
      )}
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(showIcon && 'pl-9', value && 'pr-9', inputClassName)}
        size={size}
        aria-label={ariaLabel}
        maxLength={SEARCH_LIMITS.maxLength}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size={clearBtnSize}
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <XIcon className={iconSize} weight="bold" />
        </Button>
      )}
    </div>
  )
}

export { SEARCH_LIMITS }
