/**
 * Sidebar Store - TanStack Store pattern
 *
 * Minimal store for sidebar collapse state.
 * Used by search to collapse sidebar when open.
 */
import { Store } from '@tanstack/store'

export const sidebarStore = new Store({ isCollapsed: false })

export const sidebarActions = {
  collapse: () => sidebarStore.setState(() => ({ isCollapsed: true })),
  expand: () => sidebarStore.setState(() => ({ isCollapsed: false })),
  toggle: () => sidebarStore.setState((s) => ({ isCollapsed: !s.isCollapsed })),
} as const
