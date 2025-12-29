/**
 * TagsField - Composable tags/chip input field
 *
 * A reusable component for managing arrays of string tags.
 * Refactored to be cleaner, with toggleable suggestions and isolated error states.
 */
import { useCallback, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { spacing } from '@/lib/design'

interface TagsFieldProps {
  label: string
  value: Array<string>
  onChange: (tags: Array<string>) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
  maxTags?: number
  maxTagLength?: number
  error?: string
  suggestions?: ReadonlyArray<string>
}

export function TagsField({
  label,
  value = [],
  onChange,
  onBlur,
  placeholder = 'e.g., Creative, Optimistic, Night Owl',
  className,
  maxTags = 10,
  maxTagLength = 20,
  error,
  suggestions = [],
}: TagsFieldProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [invalidInputError, setInvalidInputError] = useState('')

  const charCount = inputValue.length

  const hasError = !!error || !!invalidInputError
  const hasSuggestions = suggestions.length > 0
  const isMaxReached = value.length >= maxTags

  const addTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim().toLowerCase()
      if (!trimmedTag) return

      // Validate: only alphanumeric, spaces, and specific tech symbols (+, #, .) allowed
      // Explicitly disallow special chars like %, @, !, etc.
      const validTagRegex = /^[a-zA-Z0-9\s+#.]+$/
      if (!validTagRegex.test(trimmedTag)) {
        // Show error for invalid input
        setInvalidInputError('Letters, numbers, and symbols (+, #, .) only')
        return
      }

      // Validate: max length per tag
      if (trimmedTag.length > maxTagLength) {
        setInvalidInputError(`Max ${maxTagLength} characters per tag`)
        return
      }

      // Clear any previous invalid input error
      setInvalidInputError('')

      // Always clear input after attempting to add valid tag
      setInputValue('')

      // Silently ignore duplicates and max limit
      if (value.includes(trimmedTag)) return
      if (value.length >= maxTags) return

      onChange([...value, trimmedTag])
    },
    [value, onChange, maxTags],
  )

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove))
    },
    [value, onChange],
  )

  const toggleSuggestion = useCallback(
    (suggestion: string) => {
      const normalizedSuggestion = suggestion.toLowerCase()
      // Only add if not already selected AND not at max limit
      if (value.includes(normalizedSuggestion)) {
        // Already selected - remove it
        onChange(value.filter((tag) => tag !== normalizedSuggestion))
      } else if (value.length < maxTags) {
        // Not selected and under limit - add it
        onChange([...value, normalizedSuggestion])
      }
      // If at max limit and not selected, do nothing (suggestion stays visible)
    },
    [value, onChange, maxTags],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow Enter, comma, Backspace, Delete, Tab, Escape, Arrow keys
      if (
        [
          'Enter',
          ',',
          'Backspace',
          'Delete',
          'Tab',
          'Escape',
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
        ].includes(e.key)
      ) {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault()
          addTag(inputValue)
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
          removeTag(value[value.length - 1])
        }
        return
      }

      // Prevent typing special characters that aren't allowed
      // Only allow alphanumeric, spaces, +, #, and .
      const allowedChars = /^[a-zA-Z0-9\s+#.]+$/
      const char = e.key

      // Check if it's a single character key (not a control key)
      if (char.length === 1 && !allowedChars.test(char)) {
        e.preventDefault()
        setInvalidInputError('Letters, numbers, and symbols (+, #, .) only')
      }
    },
    [inputValue, value, addTag, removeTag],
  )

  // Filter out already selected tags from suggestions
  const filteredSuggestions = suggestions.filter(
    (s) => !value.includes(s.toLowerCase()),
  )

  return (
    <div className={cn('w-full space-y-2', className)}>
      <Label className={cn(hasError && 'text-destructive')}>{label}</Label>

      <div className="space-y-3 w-full">
        {/* Input and Add Button - Stacked */}
        <div className={`flex flex-col ${spacing.gap.sm} w-full`}>
          <Input
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value
              if (newValue.length <= maxTagLength) {
                setInputValue(newValue)
                // Clear invalid input error when user starts typing
                if (invalidInputError) setInvalidInputError('')
              }
            }}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            placeholder={
              isMaxReached
                ? "✨ Max limit reached. You're fully tagged!"
                : placeholder
            }
            disabled={isMaxReached}
            aria-invalid={hasError}
            size="lg"
            variant={hasError ? 'destructive' : 'default'}
            maxLength={maxTagLength}
            charCount={!isMaxReached ? charCount : undefined}
            className={cn(
              'w-full transition-colors duration-200',
              isMaxReached &&
                'opacity-60 bg-muted/50 cursor-not-allowed text-center font-medium placeholder:text-muted-foreground',
            )}
          />
          {(error || invalidInputError) && (
            <p className="text-sm text-destructive" role="alert">
              {invalidInputError || error}
            </p>
          )}
          {!isMaxReached && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => addTag(inputValue)}
              disabled={!inputValue.trim() || isMaxReached}
              className="w-full active:scale-[0.98] transition-all"
            >
              Add
            </Button>
          )}
        </div>

        {/* Dynamic Container for Tags and Suggestions */}
        <div className={`flex flex-col ${spacing.gap.md}`}>
          {/* Selected Tags Area */}
          {/* We keep toggle here to be close to selected tags, but visually distinct */}
          <div
            className={`flex flex-wrap ${spacing.gap.sm} items-center min-h-8`}
          >
            {value.map((tag) => (
              <Badge
                key={tag}
                variant="default" // Primary color for selected
                className="rounded-xl px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer active:scale-95 select-none max-w-full truncate"
                onClick={() => removeTag(tag)}
              >
                {tag}
              </Badge>
            ))}

            {/* Suggestions Toggle - Hides if max reached */}
            {hasSuggestions && !isMaxReached && (
              <Badge
                variant="default"
                className={cn(
                  'rounded-xl cursor-pointer px-3 py-1.5 text-sm font-medium transition-colors active:scale-95 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  showSuggestions
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 border-transparent',
                )}
                onClick={() => setShowSuggestions(!showSuggestions)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setShowSuggestions(!showSuggestions)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={showSuggestions}
                aria-label={
                  showSuggestions ? 'Hide suggestions' : 'Show suggestions'
                }
              >
                {showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
              </Badge>
            )}
          </div>

          {/* Suggestions Zone - Visually separated by being in a new flex block */}
          {showSuggestions && !isMaxReached && (
            <div className={`flex flex-wrap ${spacing.gap.sm} pt-2 pb-1`}>
              {filteredSuggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  // Custom style to match unselected SelectionCard exactly
                  className="rounded-xl bg-muted/30 text-muted-foreground hover:bg-muted/50 border-transparent cursor-pointer px-3 py-1.5 text-sm font-medium transition-colors active:scale-95 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => toggleSuggestion(suggestion)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleSuggestion(suggestion)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Add ${suggestion} tag`}
                >
                  {suggestion}
                </Badge>
              ))}

              {filteredSuggestions.length === 0 && (
                <span className="text-sm text-muted-foreground italic px-2">
                  All suggestions selected
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
