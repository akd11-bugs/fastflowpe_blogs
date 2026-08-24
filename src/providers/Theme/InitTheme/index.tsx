import Script from 'next/script'
import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    // Site is light-only — mirrors providers/Theme/shared.ts's
    // getImplicitPreference, which this inline script can't import since it
    // has to run before any JS bundle loads.
    function getImplicitPreference() {
      return 'light'
    }

    // Only 'light' is a valid stored preference now, so a visitor who toggled
    // dark mode before this change and still has it in localStorage doesn't
    // keep seeing it — the stale value just falls through to the default below.
    function themeIsValid(theme) {
      return theme === 'light'
    }

    var themeToSet = '${defaultTheme}'
    var preference = window.localStorage.getItem('${themeLocalStorageKey}')

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      var implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
  })();
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
