import { createContext, use, useEffect, useState } from 'react'

import type { ReactNode } from 'react'
import type { AppTheme, UserTheme } from '@/lib/theme'

import {
  getStoredUserTheme,
  getSystemTheme,
  handleThemeChange,
  setStoredTheme,
  setupPreferredListener,
} from '@/lib/theme'

type ThemeContextProps = {
  userTheme: UserTheme
  appTheme: AppTheme
  setTheme: (theme: UserTheme) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [userTheme, setUserTheme] = useState<UserTheme>('system')

  // Sync with localStorage on client hydration
  useEffect(() => {
    const storedTheme = getStoredUserTheme()
    setUserTheme(storedTheme)
    handleThemeChange(storedTheme)
  }, [])

  // Set up system preference listener when userTheme is 'system'
  useEffect(() => {
    if (userTheme !== 'system') return
    return setupPreferredListener(() => handleThemeChange('system'))
  }, [userTheme])

  const appTheme: AppTheme =
    userTheme === 'system' ? getSystemTheme() : userTheme

  const setTheme = (newUserTheme: UserTheme) => {
    setUserTheme(newUserTheme)
    setStoredTheme(newUserTheme)
    handleThemeChange(newUserTheme)
  }

  return (
    <ThemeContext value={{ userTheme, appTheme, setTheme }}>
      {children}
    </ThemeContext>
  )
}

export function useTheme() {
  const context = use(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
