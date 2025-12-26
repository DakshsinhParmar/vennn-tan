import { z } from 'zod'

// Theme type definitions
const UserThemeSchema = z.enum(['light', 'dark', 'system']).catch('system')
const AppThemeSchema = z.enum(['light', 'dark']).catch('light')

export type UserTheme = z.infer<typeof UserThemeSchema>
export type AppTheme = z.infer<typeof AppThemeSchema>

export const themes: Array<UserTheme> = ['light', 'dark', 'system']
const themeStorageKey = 'ui-theme'

/**
 * Get the stored user theme from localStorage.
 * Returns 'system' on server or if localStorage is unavailable.
 */
export function getStoredUserTheme(): UserTheme {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = localStorage.getItem(themeStorageKey)
    return UserThemeSchema.parse(stored)
  } catch {
    return 'system'
  }
}

/**
 * Store the user theme in localStorage.
 * No-ops on server.
 */
export function setStoredTheme(theme: UserTheme): void {
  if (typeof window === 'undefined') return
  try {
    const validatedTheme = UserThemeSchema.parse(theme)
    localStorage.setItem(themeStorageKey, validatedTheme)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get the system/OS theme preference.
 * Returns 'light' on server.
 */
export function getSystemTheme(): AppTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * Apply theme to the document root element using data-theme attribute.
 */
export function handleThemeChange(userTheme: UserTheme): void {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  const resolvedTheme = userTheme === 'system' ? getSystemTheme() : userTheme

  // Set data-theme for the actual theme applied
  root.setAttribute('data-theme', resolvedTheme)
  // Set data-user-theme for the user's preference
  root.setAttribute('data-user-theme', userTheme)

  // Also set class for backward compatibility with Tailwind dark: variant
  root.classList.remove('light', 'dark')
  root.classList.add(resolvedTheme)
}

/**
 * Set up a listener for system theme preference changes.
 * Returns a cleanup function.
 */
export function setupPreferredListener(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

/**
 * Inline script to run before hydration to prevent FOUC.
 * This sets the correct theme immediately on page load before any rendering.
 * CRITICAL: This must be in the <head> before <body> for zero flash.
 */
export const themeScript: string = `(function(){try{var e=localStorage.getItem('ui-theme')||'system',t=['light','dark','system'].includes(e)?e:'system',n='system'===t?window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light':t;document.documentElement.setAttribute('data-theme',n);document.documentElement.setAttribute('data-user-theme',t);document.documentElement.classList.add(n)}catch(e){var n=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',n);document.documentElement.setAttribute('data-user-theme','system');document.documentElement.classList.add(n)}})();`
