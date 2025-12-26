/**
 * Library Exports
 *
 * Central export point for all lib utilities.
 * Import from '@/lib' for convenience.
 */

// Utilities
export { cn } from './utils'

// Design system (primary - use for new code)
export {
  design,
  spacing,
  container,
  text,
  icon,
  component,
  transition,
  zIndex,
  limits,
} from './design'

// Theme
export {
  getStoredUserTheme,
  setStoredTheme,
  getSystemTheme,
  handleThemeChange,
  setupPreferredListener,
  themeScript,
  themes,
  type UserTheme,
  type AppTheme,
} from './theme'
