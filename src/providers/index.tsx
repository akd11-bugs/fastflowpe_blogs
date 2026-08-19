import React from 'react'

import { CursorProvider } from './Cursor'
import { HeaderThemeProvider } from './HeaderTheme'
import { SmoothScrollProvider } from './SmoothScroll'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <CursorProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </CursorProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
