import { useCallback, useEffect, useRef } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { limits, icon, transition } from '@/lib/design'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  'aria-label'?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  autoFocus = false,
  className,
  'aria-label': ariaLabel = 'Search',
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const sanitizeValue = useCallback((input: string): string => {
    return input
      .split('')
      .filter((char) => {
        const code = char.charCodeAt(0)
        const isControlChar = code < 32 || code === 127
        const isZeroWidth =
          (code >= 0x200b && code <= 0x200d) ||
          code === 0xfeff ||
          code === 0x00ad
        return !isControlChar && !isZeroWidth
      })
      .join('')
      .slice(0, limits.search.max)
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(sanitizeValue(e.target.value))
    },
    [onChange, sanitizeValue],
  )

  const handleClear = useCallback(() => {
    onChange('')
    inputRef.current?.focus()
  }, [onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && value) {
        e.preventDefault()
        handleClear()
      }
    },
    [value, handleClear],
  )

  useEffect(() => {
    if (autoFocus) {
      const id = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
  }, [autoFocus])

  return (
    <div className={cn('relative flex-1', className)}>
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        unstyled
        className={cn(
          'w-full h-9 bg-transparent rounded-lg px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground/72',
          value && 'pr-8',
        )}
        aria-label={ariaLabel}
        maxLength={limits.search.max}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground z-10',
            transition.colors,
          )}
          aria-label="Clear"
        >
          <XIcon className={icon.xs} weight="bold" />
        </button>
      )}
    </div>
  )
}
