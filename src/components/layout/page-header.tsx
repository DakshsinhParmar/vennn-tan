import type { ReactNode } from 'react'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { container } from '@/lib/design'
import { Button } from '../ui/button'

export interface PageHeaderProps {
  children?: ReactNode
  title?: string
  titleClassName?: string
  titleSuffix?: ReactNode
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  bottom?: ReactNode
  className?: string
  showBackButton?: boolean
}

/**
 * Responsive page header container
 * Renders in a sticky position with backdrop blur
 */
export function PageHeader({
  children,
  title,
  titleClassName,
  titleSuffix,
  primaryAction,
  secondaryAction,
  bottom,
  className,
  showBackButton,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full mx-auto bg-background',
        container.maxWidth.md,
        className,
      )}
    >
      <div
        className={cn(
          'flex h-14 items-center justify-between',
          !children && !title && !primaryAction && !secondaryAction
            ? 'hidden'
            : '',
        )}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showBackButton && (
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              size="icon"
              className=""
              aria-label="Go back"
            >
              <ArrowLeftIcon weight="bold" />
            </Button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            {title && (
              <h1
                className={cn(
                  'text-base font-bold tracking-tight truncate',
                  titleClassName,
                )}
              >
                {title}
              </h1>
            )}
            {titleSuffix}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {children}
          {primaryAction}
          {secondaryAction}
        </div>
      </div>
      {bottom && <div className="w-full pb-2">{bottom}</div>}
    </header>
  )
}
