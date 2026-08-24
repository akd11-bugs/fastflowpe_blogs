export type Theme = 'dark' | 'light'

export interface ThemeContextType {
  setTheme: (theme: Theme | null) => void
  theme?: Theme | null
}

/**
 * Only 'light' is a valid STORED site-wide preference — the site is light-only
 * now. `Theme` itself keeps both values because HeaderTheme (a separate
 * concern: header text contrast over a photographic hero, set directly by
 * hero components) still legitimately uses 'dark'; this only gates what
 * ThemeProvider will accept out of localStorage.
 */
export function themeIsValid(string: null | string): string is Theme {
  return string === 'light'
}
