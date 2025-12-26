/**
 * SelectionCard - Reusable selection button component
 *
 * A composable card component for single/multi selection UI patterns.
 * Used for:
 * - Post type selection (build/social)
 * - Intent selection (build/socialize)
 * - Availability selection (open/specific)
 */
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SelectionCardProps {
  selected: boolean
  onClick?: () => void
  icon: ReactNode
  title: string
  description: string
  disabled?: boolean
  /** When true, renders as a non-interactive div (display-only) */
  readOnly?: boolean
  className?: string
}

export function SelectionCard({
  selected,
  onClick,
  icon,
  title,
  description,
  disabled = false,
  readOnly = false,
  className,
}: SelectionCardProps) {
  const baseStyles = cn(
    'flex items-center gap-3 rounded-xl p-3 text-left transition-all w-full',
    selected ? 'bg-primary text-primary-foreground' : 'bg-muted/30',
    !readOnly && !selected && 'hover:bg-muted/50',
    disabled && 'opacity-50 cursor-not-allowed',
    readOnly && 'cursor-default',
    className,
  )

  // Render as a div when read-only for accessibility
  if (readOnly) {
    return (
      <div
        className={baseStyles}
        role="status"
        aria-label={`${title}: ${selected ? 'Selected' : 'Not selected'}`}
      >
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
            selected
              ? 'bg-primary-foreground/20 text-primary-foreground'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm leading-tight">{title}</p>
          <p
            className={cn(
              'text-xs mt-0.5 opacity-90',
              selected ? 'text-primary-foreground/80' : 'text-muted-foreground',
            )}
          >
            {description}
          </p>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
          selected
            ? 'bg-primary-foreground/20 text-primary-foreground'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm leading-tight">{title}</p>
        <p
          className={cn(
            'text-xs mt-0.5 opacity-90',
            selected ? 'text-primary-foreground/80' : 'text-muted-foreground',
          )}
        >
          {description}
        </p>
      </div>
    </button>
  )
}
