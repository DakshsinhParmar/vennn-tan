import { DesktopIcon, MoonIcon, SunIcon } from '@phosphor-icons/react'
import type { UserTheme } from '@/lib/theme'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

const themeConfig: Record<UserTheme, { icon: React.ReactNode; label: string }> =
  {
    light: { icon: <SunIcon weight="bold" />, label: 'Light' },
    dark: { icon: <MoonIcon weight="bold" />, label: 'Dark' },
    system: { icon: <DesktopIcon weight="bold" />, label: 'System' },
  }

const themes: Array<UserTheme> = ['light', 'dark', 'system']

export function ThemeToggle() {
  const { userTheme, setTheme } = useTheme()

  const getNextTheme = () => {
    const currentIndex = themes.indexOf(userTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    return themes[nextIndex]
  }

  const currentConfig = themeConfig[userTheme]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(getNextTheme())}
      aria-label={`Switch to ${getNextTheme()} theme`}
      title={`Current: ${currentConfig.label}`}
    >
      {currentConfig.icon}
    </Button>
  )
}
