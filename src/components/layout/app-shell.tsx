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
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Removed unused
  const mainContentClass = undefined

  return (
    <>
      {/* Mobile: Header + Sidebar Drawer + Content */}
      <div className="sm:hidden flex flex-col min-h-dvh bg-background text-foreground">
        <MainContent variant="mobile" className={mainContentClass}>
          {children}
        </MainContent>

        {bottomBarContent && (
          <MobileBottomBar>{bottomBarContent}</MobileBottomBar>
        )}
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
