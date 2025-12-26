import type { ReactNode } from 'react'

interface MobileBottomBarProps {
  children?: ReactNode
}

export function MobileBottomBar({ children }: MobileBottomBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 py-2 bg-background pb-[env(safe-area-inset-bottom)]">
      {children}
    </nav>
  )
}
