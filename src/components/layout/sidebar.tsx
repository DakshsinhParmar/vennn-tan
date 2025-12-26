import type { ReactNode } from 'react'
import { IntersectSquareIcon } from '@phosphor-icons/react'
import { useSidebarState } from '@/hooks/use-sidebar'
import { cn } from '@/lib/utils'

interface SidebarProps {
  children?: ReactNode
}

/** Desktop sidebar - fixed overlay, collapses to icon-width when search is open */
export function Sidebar({ children }: SidebarProps) {
  const isCollapsed = useSidebarState()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-background',
        isCollapsed ? 'w-16' : 'w-16 lg:w-56',
      )}
    >
      <div
        className={cn(
          'flex h-14 items-center justify-center text-primary',
          !isCollapsed && 'lg:justify-start lg:pl-3',
        )}
      >
        <div className={cn('lg:hidden', isCollapsed && 'lg:block')}>
          <IntersectSquareIcon className="size-6" weight="duotone" />
        </div>

        {/* Text Logo for expanded state */}
        {!isCollapsed && (
          <div className="hidden lg:flex items-center gap-2 font-bold text-xl tracking-tight ml-2">
            <span className="tracking-tighter font-semibold">vennn</span>
          </div>
        )}
      </div>
      {children}
    </aside>
  )
}
