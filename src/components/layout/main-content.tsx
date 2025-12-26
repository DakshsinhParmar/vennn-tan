import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { layout } from '@/lib/design'

interface MainContentProps {
  children?: ReactNode
  variant: 'mobile' | 'desktop'
  className?: string
}

/**
 * MainContent - Scrollable content area
 *
 * Mobile: scrolls with document, padding at bottom for bottom bar
 * Desktop: fixed position, centered with left offset for sidebar
 */
export function MainContent({
  children,
  variant,
  className,
}: MainContentProps) {
  if (variant === 'mobile') {
    return (
      <main className={cn(`min-h-dvh pb-16 ${layout.page.padding}`, className)}>
        {children}
      </main>
    )
  }

  // Desktop variant - content centered absolutely on viewport
  return (
    <main
      className={cn(
        `absolute inset-0 overflow-y-auto ${layout.page.padding}`,
        className,
      )}
    >
      <div className="flex min-h-full justify-center">
        <div className="w-full">{children}</div>
      </div>
    </main>
  )
}
