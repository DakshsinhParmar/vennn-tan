/**
 * Navigation Components - Sidebar and mobile navigation
 *
 * SidebarNavigation: Desktop sidebar with links, search, and collapsed state
 * MobileNavigation: Bottom tab bar for mobile devices
 */
import { Link, useRouterState } from '@tanstack/react-router'
import {
  BinocularsIcon,
  BellSimpleIcon,
  HouseIcon,
  LifebuoyIcon,
  PlusCircleIcon,
  SmileyIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { SearchPanel } from '../search'
import type { Icon } from '@phosphor-icons/react'
import { useSidebarActions, useSidebarState } from '@/hooks/use-sidebar'
import { icon as iconSize } from '@/lib/design'

// Use centralized icon size
const ICON_SIZE = iconSize.md

interface NavItem {
  to: string
  label: string
  Icon: Icon
  isSearch?: boolean
  hideOnMobile?: boolean
  isExternal?: boolean
  externalUrl?: string
}

const NAV_ITEMS: Array<NavItem> = [
  { to: '/home', label: 'Home', Icon: HouseIcon },
  { to: '/explore', label: 'Search', Icon: BinocularsIcon, isSearch: true },
  { to: '/create', label: 'Create', Icon: PlusCircleIcon },
  { to: '/notifications', label: 'Notifications', Icon: BellSimpleIcon },
  { to: '/profile', label: 'Profile', Icon: SmileyIcon },
  {
    to: '#',
    label: 'Reviews',
    Icon: LifebuoyIcon,
    hideOnMobile: true,
    isExternal: true,
    externalUrl: 'https://vennn.featurebase.app/',
  },
]

function useIsActive(to: string): boolean {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

// Sidebar Navigation
export function SidebarNavigation() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { collapse, expand } = useSidebarActions()

  const handleSearchToggle = () => {
    setSearchOpen(true)
    collapse()
  }

  const handleSearchClose = () => {
    setSearchOpen(false)
    expand()
  }

  const handleNavClick = () => {
    setSearchOpen(false)
    expand()
  }

  return (
    <>
      <nav className="flex flex-col gap-1 p-2 items-center">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.to}
            item={item}
            searchOpen={searchOpen}
            onSearchToggle={handleSearchToggle}
            onNavClick={handleNavClick}
            variant="sidebar"
          />
        ))}
      </nav>
      <SearchPanel open={searchOpen} onClose={handleSearchClose} />
    </>
  )
}

// Unified NavButton component
interface NavButtonProps {
  item: NavItem
  searchOpen: boolean
  onSearchToggle: () => void
  onNavClick: () => void
  variant: 'sidebar' | 'mobile'
}

// Shared button class for consistent sizing
const NAV_BUTTON_CLASS = 'size-11 justify-center' as const
const NAV_BUTTON_SIDEBAR_CLASS =
  'size-11 justify-center lg:w-full lg:justify-start lg:pl-3' as const

function NavButton({
  item,
  searchOpen,
  onSearchToggle,
  onNavClick,
  variant,
}: NavButtonProps) {
  const isActive = useIsActive(item.to)
  const isCollapsed = useSidebarState()
  const showLabel = variant === 'sidebar' && !isCollapsed
  const buttonClass =
    variant === 'sidebar' && !isCollapsed
      ? NAV_BUTTON_SIDEBAR_CLASS
      : NAV_BUTTON_CLASS

  if (item.isSearch) {
    return (
      <Button onClick={onSearchToggle} variant="ghost" className={buttonClass}>
        <item.Icon
          weight={searchOpen ? 'fill' : 'regular'}
          className={ICON_SIZE}
        />
        {showLabel && (
          <span className="hidden lg:inline text-sm font-medium ml-2">
            {item.label}
          </span>
        )}
        <span className="sr-only">{item.label}</span>
      </Button>
    )
  }

  // Handle external links (e.g., FeatureBase)
  if (item.isExternal && item.externalUrl) {
    return (
      <Button
        variant="ghost"
        className={buttonClass}
        render={
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <item.Icon weight="regular" className={ICON_SIZE} />
        {showLabel && (
          <span className="hidden lg:inline text-sm font-medium ml-2">
            {item.label}
          </span>
        )}
        <span className="sr-only">{item.label}</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      className={buttonClass}
      onClick={onNavClick}
      render={<Link to={item.to} />}
    >
      <item.Icon weight={isActive ? 'fill' : 'regular'} className={ICON_SIZE} />
      {showLabel && (
        <span className="hidden lg:inline text-sm font-medium ml-2">
          {item.label}
        </span>
      )}
      <span className="sr-only">{item.label}</span>
    </Button>
  )
}

// Mobile Bottom Navigation
export function MobileNavigation() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { collapse, expand } = useSidebarActions()

  const handleSearchToggle = () => {
    setSearchOpen(true)
    collapse()
  }

  const handleSearchClose = () => {
    setSearchOpen(false)
    expand()
  }

  // Filter items for mobile
  const mobileItems = NAV_ITEMS.filter((item) => !item.hideOnMobile)

  return (
    <>
      <nav className="flex items-center justify-around w-full h-full px-2">
        {mobileItems.map((item) => (
          <NavButton
            key={item.to}
            item={item}
            searchOpen={searchOpen}
            onSearchToggle={handleSearchToggle}
            onNavClick={() => setSearchOpen(false)}
            variant="mobile"
          />
        ))}
      </nav>
      <SearchPanel open={searchOpen} onClose={handleSearchClose} />
    </>
  )
}
