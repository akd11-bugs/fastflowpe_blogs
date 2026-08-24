import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'

export const defaultTheme = 'light'

/**
 * Site is light-only. This used to detect `prefers-color-scheme: dark` and
 * switch automatically; now it always resolves to light regardless of the
 * visitor's OS setting, so nothing else in the theme system needs to change —
 * ThemeProvider's init effect and InitTheme's inline script both just end up
 * with 'light' every time.
 */
export const getImplicitPreference = (): Theme | null => 'light'
