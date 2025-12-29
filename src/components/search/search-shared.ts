import { useMemo } from 'react'

export interface SearchPerson {
  id: string
  name: string
  avatar?: string
  username?: string
}

export const DEMO_PEOPLE: SearchPerson[] = [
  { id: '1', name: 'Sarah Johnson', username: '@sarahj' },
  { id: '2', name: 'Michael Chen', username: '@mchen' },
  { id: '3', name: 'Emma Wilson', username: '@emmaw' },
  { id: '4', name: 'David Brown', username: '@davidb' },
  { id: '5', name: 'Lisa Anderson', username: '@lisaa' },
  { id: '6', name: 'James Martinez', username: '@jamesm' },
  { id: '7', name: 'Jennifer Taylor', username: '@jent' },
  { id: '8', name: 'Robert Lee', username: '@robl' },
]

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 1)
}

export function useSearchFilter(query: string) {
  const filteredPeople = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return DEMO_PEOPLE.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.username?.toLowerCase().includes(q),
    )
  }, [query])

  return { filteredPeople, hasResults: filteredPeople.length > 0 }
}
