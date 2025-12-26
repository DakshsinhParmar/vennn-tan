import { useCallback, useState } from 'react'
import { TrashIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { LinkItem } from '@/lib/form'

interface LinksFieldProps {
  label: string
  value: Array<LinkItem>
  onChange: (links: Array<LinkItem>) => void
  onBlur?: () => void
  className?: string
  maxLinks?: number
  urlPlaceholder?: string
  error?: string
  /** When true, shows validation errors on empty inputs */
  showValidation?: boolean
}

export function LinksField({
  label,
  value = [],
  onChange,
  onBlur,
  className,
  maxLinks = 5,
  urlPlaceholder = 'https://example.com',
  error,
  showValidation = false,
}: LinksFieldProps) {
  const hasError = !!error
  // Check if any links are empty
  const hasEmptyLinks = showValidation && value.some((l) => !l.url.trim())

  // Check if the last link is complete (field filled)
  const lastLink = value[value.length - 1]
  const canAddMore =
    value.length < maxLinks && (value.length === 0 || lastLink?.url.trim())

  // Track if we should focus the new input (only after user adds a link)
  const [shouldFocus, setShouldFocus] = useState(false)

  // Focus the new input after adding - using callback ref pattern
  const focusNewInput = useCallback(
    (el: HTMLInputElement | null) => {
      if (shouldFocus && el) {
        el.focus()
        setShouldFocus(false)
      }
    },
    [shouldFocus],
  )

  const addLink = () => {
    if (!canAddMore) return
    setShouldFocus(true)
    onChange([...value, { url: '' }])
  }

  const removeLink = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, newValue: string) => {
    // Check if this URL already exists in another link (case-insensitive)
    const normalizedNewValue = newValue.trim().toLowerCase()
    const isDuplicate =
      normalizedNewValue &&
      value.some(
        (link, i) =>
          i !== index && link.url.trim().toLowerCase() === normalizedNewValue,
      )

    // Don't update if it would create a duplicate
    if (isDuplicate) return

    const updated = value.map((link, i) =>
      i === index ? { ...link, url: newValue } : link,
    )
    onChange(updated)
  }

  // Validate if a URL is valid
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true // Empty is handled separately
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className={cn('w-full space-y-2', className)}>
      <Label className={cn((hasError || hasEmptyLinks) && 'text-destructive')}>
        {label}
      </Label>

      <div className="space-y-3 w-full">
        {value.map((link, index) => {
          const isEmpty = !link.url.trim()
          const isLast = index === value.length - 1

          // Check if this link is a duplicate (case-insensitive)
          const normalizedUrl = link.url.trim().toLowerCase()
          const isDuplicate =
            normalizedUrl &&
            value.findIndex(
              (l) => l.url.trim().toLowerCase() === normalizedUrl,
            ) < index // Only show error on duplicates, not the first occurrence

          // Check if URL is valid
          const isInvalidUrl = link.url.trim() && !isValidUrl(link.url)

          const showInputError =
            (isEmpty && showValidation) || isDuplicate || isInvalidUrl
          const inputErrorMessage = isDuplicate
            ? 'Link already added'
            : isInvalidUrl
              ? 'Please enter a valid URL'
              : 'Link cannot be empty'

          return (
            <div key={index} className="space-y-1">
              <div className="flex w-full gap-2 items-center">
                <Input
                  ref={isLast ? focusNewInput : undefined}
                  value={link.url}
                  onChange={(e) => updateLink(index, e.target.value)}
                  onBlur={onBlur}
                  placeholder={urlPlaceholder}
                  type="url"
                  className="w-full flex-1"
                  size="lg"
                  variant={showInputError ? 'destructive' : 'default'}
                  aria-invalid={showInputError ? true : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeLink(index)}
                  aria-label="Remove link"
                >
                  <TrashIcon className="size-5" />
                </Button>
              </div>
              {showInputError && (
                <p className="text-sm text-destructive" role="alert">
                  {inputErrorMessage}
                </p>
              )}
            </div>
          )
        })}

        {value.length < maxLinks && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={addLink}
            disabled={!canAddMore}
            className={cn('w-full', !canAddMore && 'cursor-not-allowed')}
          >
            Add Link
          </Button>
        )}
      </div>
    </div>
  )
}
