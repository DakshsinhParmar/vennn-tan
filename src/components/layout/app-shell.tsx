/**
 * AppShell - Main application layout wrapper
 *
 * Handles responsive layout with:
 * - Mobile: Fixed header + scrollable content + bottom navigation
 * - Desktop: Fixed sidebar + centered scrollable content
 */
import { Sidebar } from './sidebar'
import { MobileBottomBar } from './mobile-bottom-bar'
import { MainContent } from './main-content'
import type { ReactNode } from 'react'

interface AppShellProps {
  children?: ReactNode
  sidebarContent?: ReactNode
  bottomBarContent?: ReactNode
}

export function AppShell({
  children,
  sidebarContent,
  bottomBarContent,
}: AppShellProps) {
  // Get route-specific content width
  const mainContentClass = undefined

  return (
    <>
      {/* Mobile: fixed chrome + document scroll */}
      <div className="sm:hidden">
        {/* Header is now handled by pages individually via PageHeader */}
        <MobileBottomBar>{bottomBarContent}</MobileBottomBar>
        <MainContent variant="mobile" className={mainContentClass}>
          {children}
        </MainContent>
      </div>

      {/* Desktop: sidebar fixed, content absolutely centered */}
      <div className="hidden sm:block fixed inset-0 h-dvh bg-background">
        <Sidebar>{sidebarContent}</Sidebar>
        <MainContent variant="desktop" className={mainContentClass}>
          {children}
        </MainContent>
      </div>
    </>
  )
}
