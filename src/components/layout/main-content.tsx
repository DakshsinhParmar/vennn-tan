import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MainContentProps {
  children?: ReactNode
  variant: 'mobile' | 'desktop'
  className?: string
}

export function MainContent({
  children,
  variant,
  className,
}: MainContentProps) {
  if (variant === 'mobile') {
    return (
      <main className={cn('min-h-dvh pb-16 px-4', className)}>{children}</main>
    )
  }

  return (
    <main className={cn('absolute inset-0 overflow-y-auto px-4', className)}>
      <div className="flex min-h-full justify-center">
        <div className="w-full">{children}</div>
      </div>
    </main>
  )
}
