// Next's App Router aliases `react`/`react-dom` to a bundled React canary build at
// build time, which is where `ViewTransition` actually ships — the installed
// `react` package's own types don't declare it. This one-time augmentation
// (per @types/react/canary.d.ts's own instructions) makes `import { ViewTransition }
// from 'react'` type-check without needing a project-wide "types" array change.
import {} from 'react/canary'
