/**
 * Sidebar Hook - Simple interface to sidebar state
 */
import { useStore } from '@tanstack/react-store'
import { sidebarActions, sidebarStore } from '@/stores/sidebar-store'

/** Get collapsed state (reactive) */
export function useSidebarState() {
  return useStore(sidebarStore, (s) => s.isCollapsed)
}

/** Get actions (stable references) */
export function useSidebarActions() {
  return sidebarActions
}
