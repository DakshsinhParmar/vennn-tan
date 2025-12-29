import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { SearchInput } from './search-input'
import { Button } from '@/components/ui/button'
import { useSearchFilter } from './search-shared'
import { UserAvatar, ItemRow } from '@/components/shared'
import { container, icon } from '@/lib/design'

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

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

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
    <div className="space-y-1">
      {filteredPeople.map((person) => (
        <button
          key={person.id}
          onClick={() => handleNavigate()}
          className="w-full text-left px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
        >
          <ItemRow
            left={
              <UserAvatar name={person.name} avatar={person.avatar} size="sm" />
            }
            primary={person.name}
            secondary={person.username ? `@${person.username}` : undefined}
          />
        </button>
      ))}
    </div>
  )

  return createPortal(
    <>
      {/* Desktop backdrop */}
      <div
        className="fixed inset-0 hidden lg:block z-55 bg-black/5"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile only: full screen overlay */}
      <div
        className="fixed inset-0 z-60 bg-background flex flex-col lg:hidden"
        role="search"
        aria-label="Search"
      >
        <div
          className={`flex items-center ${container.height.header} px-2 shrink-0 gap-2`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Back"
            className="shrink-0"
          >
            <ArrowLeftIcon className={icon.sm} weight="bold" />
          </Button>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search people..."
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {!hasResults ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            results
          )}
        </div>
      </div>

      {/* Desktop only: side panel */}
      <aside
        className="fixed left-16 top-0 bottom-0 w-72 hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border z-60"
        role="search"
        aria-label="Search panel"
      >
        <div className="flex items-center h-14 px-3 shrink-0">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search..."
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-2 pb-2">
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
