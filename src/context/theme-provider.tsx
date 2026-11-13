import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

const COLOR_THEMES = [
  'default',
  'retro-blue',
  'claude',
  'command-center',
  'homeui',
  'schemablue',
  'mistral',
  'supabase',
  'noirluxe',
  'softro',
  'duolingo',
  'cloudflare',
  'hubspot',
  'canva',
  'stripe',
  'skylearn',
  'questui',
  'garden-fresh',
] as const
type ColorTheme = (typeof COLOR_THEMES)[number]

const DEFAULT_THEME = 'system'
const DEFAULT_COLOR_THEME: ColorTheme = 'default'
const THEME_COOKIE_NAME = 'vite-ui-theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
const COLOR_THEME_STORAGE_KEY = 'theme_id'
const GLASS_STORAGE_KEY = 'glass_enabled'
const GLASS_OPACITY_STORAGE_KEY = 'glass_opacity'
const DEFAULT_GLASS_ENABLED = false
const DEFAULT_GLASS_OPACITY = 82

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  colorTheme: ColorTheme
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  glassEnabled: boolean
  glassOpacity: number
  setColorTheme: (colorTheme: ColorTheme) => void
  setTheme: (theme: Theme) => void
  setGlassEnabled: (enabled: boolean) => void
  setGlassOpacity: (opacity: number) => void
  resetColorTheme: () => void
  resetTheme: () => void
  resetGlassEnabled: () => void
  resetGlassOpacity: () => void
}

const initialState: ThemeProviderState = {
  colorTheme: DEFAULT_COLOR_THEME,
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: 'light',
  theme: DEFAULT_THEME,
  glassEnabled: DEFAULT_GLASS_ENABLED,
  glassOpacity: DEFAULT_GLASS_OPACITY,
  setColorTheme: () => null,
  setTheme: () => null,
  setGlassEnabled: () => null,
  setGlassOpacity: () => null,
  resetColorTheme: () => null,
  resetTheme: () => null,
  resetGlassEnabled: () => null,
  resetGlassOpacity: () => null,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(
    () => (getCookie(storageKey) as Theme) || defaultTheme
  )
  const [colorTheme, _setColorTheme] = useState<ColorTheme>(() => {
    const storedColorTheme = window.localStorage.getItem(
      COLOR_THEME_STORAGE_KEY
    ) as ColorTheme | null

    return storedColorTheme && COLOR_THEMES.includes(storedColorTheme)
      ? storedColorTheme
      : DEFAULT_COLOR_THEME
  })
  const [glassEnabled, _setGlassEnabled] = useState<boolean>(
    () => window.localStorage.getItem(GLASS_STORAGE_KEY) === 'true'
  )
  const [glassOpacity, _setGlassOpacity] = useState<number>(() => {
    const storedOpacity = window.localStorage.getItem(GLASS_OPACITY_STORAGE_KEY)
    if (storedOpacity === null) return DEFAULT_GLASS_OPACITY

    const parsedOpacity = Number(storedOpacity)
    return Number.isFinite(parsedOpacity)
      ? Math.min(100, Math.max(50, parsedOpacity))
      : DEFAULT_GLASS_OPACITY
  })

  // Optimized: Memoize the resolved theme calculation to prevent unnecessary re-computations
  const resolvedTheme = useMemo((): ResolvedTheme => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme as ResolvedTheme
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
      root.classList.remove('light', 'dark') // Remove existing theme classes
      root.classList.add(currentResolvedTheme) // Add the new theme class
    }

    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        applyTheme(systemTheme)
      }
    }

    applyTheme(resolvedTheme)

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, resolvedTheme])

  useEffect(() => {
    const root = window.document.documentElement

    if (colorTheme === DEFAULT_COLOR_THEME) {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', colorTheme)
    }
  }, [colorTheme])

  useEffect(() => {
    window.document.documentElement.setAttribute(
      'data-glass',
      String(glassEnabled)
    )
  }, [glassEnabled])

  useEffect(() => {
    window.document.documentElement.style.setProperty(
      '--glass-opacity',
      `${glassOpacity}%`
    )
  }, [glassOpacity])

  const setColorTheme = (colorTheme: ColorTheme) => {
    window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, colorTheme)
    _setColorTheme(colorTheme)
  }

  const resetColorTheme = () => {
    window.localStorage.removeItem(COLOR_THEME_STORAGE_KEY)
    _setColorTheme(DEFAULT_COLOR_THEME)
  }

  const setGlassEnabled = (enabled: boolean) => {
    window.localStorage.setItem(GLASS_STORAGE_KEY, String(enabled))
    _setGlassEnabled(enabled)
  }

  const setGlassOpacity = (opacity: number) => {
    window.localStorage.setItem(GLASS_OPACITY_STORAGE_KEY, String(opacity))
    _setGlassOpacity(opacity)
  }

  const resetGlassEnabled = () => {
    window.localStorage.removeItem(GLASS_STORAGE_KEY)
    _setGlassEnabled(DEFAULT_GLASS_ENABLED)
  }

  const resetGlassOpacity = () => {
    window.localStorage.removeItem(GLASS_OPACITY_STORAGE_KEY)
    _setGlassOpacity(DEFAULT_GLASS_OPACITY)
  }

  const setTheme = (theme: Theme) => {
    setCookie(storageKey, theme, THEME_COOKIE_MAX_AGE)
    _setTheme(theme)
  }

  const resetTheme = () => {
    removeCookie(storageKey)
    _setTheme(DEFAULT_THEME)
  }

  const contextValue = {
    colorTheme,
    defaultTheme,
    resolvedTheme,
    resetColorTheme,
    resetTheme,
    resetGlassEnabled,
    resetGlassOpacity,
    setColorTheme,
    theme,
    setTheme,
    glassEnabled,
    setGlassEnabled,
    glassOpacity,
    setGlassOpacity,
  }

  return (
    <ThemeContext value={contextValue} {...props}>
      {children}
    </ThemeContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
