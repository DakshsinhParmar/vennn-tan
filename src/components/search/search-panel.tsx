/**
 * SearchPanel - Unified search component for both mobile and desktop
 *
 * Uses CSS to handle responsive behavior instead of duplicating components.
 * Desktop: Sidebar panel next to navigation
 * Mobile: Full-screen overlay
 */
import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from '@tanstack/react-router'
import { XIcon } from '@phosphor-icons/react'
import { SearchInput } from './search-input'
import { Button } from '@/components/ui/button'
import { useSearchFilter } from './search-shared'
import { UserAvatar } from '@/components/shared'
import { cn } from '@/lib/utils'
import { spacing, container, icon } from '@/lib/design'

interface SearchPanelProps {
  open: boolean
  onClose: () => void
}

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { filteredPeople, hasResults } = useSearchFilter(query)

  const handleNavigate = useCallback(() => {
    onClose()
    navigate({ to: '/profile' })
  }, [onClose, navigate])

  // Reset on close
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  // Escape key handler
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Mobile: handle back button
  useEffect(() => {
    if (!open) return
    window.history.pushState({ searchOpen: true }, '')
    const onPop = () => onClose()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [open, onClose])

  if (!open) return null

  const emptyMessage = !query
    ? 'Start typing to search...'
    : 'No results found.'

  const results = (
    <div className={spacing.stack.xs}>
      {filteredPeople.map((person) => (
        <Button
          key={person.id}
          variant="ghost"
          onClick={() => handleNavigate()}
          className="w-full justify-start gap-2 h-auto py-2 px-2 sm:px-2"
        >
          <UserAvatar name={person.name} avatar={person.avatar} size="sm" />
          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm font-medium truncate">{person.name}</span>
            {person.username && (
              <span className="text-xs text-muted-foreground sm:hidden">
                {person.username}
              </span>
            )}
          </div>
        </Button>
      ))}
    </div>
  )

  return createPortal(
    <>
      {/* Desktop: Backdrop */}
      <div
        className="fixed inset-0 hidden sm:block z-55"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile: Full screen */}
      <div
        className="fixed inset-0 z-60 bg-background flex flex-col sm:hidden"
        role="search"
        aria-label="Search"
      >
        <div
          className={`flex items-center ${container.height.header} px-2 shrink-0 ${spacing.gap.sm}`}
        >
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search..."
            autoFocus
            inputClassName="h-9"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon className={icon.sm} weight="bold" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {!hasResults ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            results
          )}
        </div>
      </div>

      {/* Desktop: Side panel */}
      <aside
        className={cn(
          'fixed left-16 border-[0.5px] top-1 bottom-1 rounded-xl hidden sm:flex flex-col bg-background z-60',
          container.sidebar.expanded,
        )}
        role="search"
        aria-label="Search panel"
      >
        <div
          className={`flex items-center ${spacing.gap.sm} ${container.height.header} px-2 shrink-0`}
        >
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search..."
            autoFocus
            inputClassName="h-9"
          />
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-3">
          {!hasResults ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            results
          )}
        </div>
      </aside>
    </>,
    document.body,
  )
}
