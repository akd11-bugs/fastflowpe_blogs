import canUseDOM from './canUseDOM'

// Falls back to the real production URL, not localhost — NEXT_PUBLIC_SERVER_URL is
// inlined at build time, so if Render's Docker build doesn't pass it through as a
// build arg, no runtime env var can correct it afterward. Without this fallback,
// every absolute URL generated server-side (canonical, og:url, og:image, JSON-LD)
// silently becomes http://localhost:3000 in production.
const PRODUCTION_URL = 'https://fastflowpe-blogs.onrender.com'

export const getServerSideURL = () => {
  const url =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.NODE_ENV === 'production'
        ? PRODUCTION_URL
        : 'http://localhost:3000')

  // Callers concatenate this with a leading "/" — a trailing slash here (e.g. a
  // misconfigured env var) would otherwise produce double-slash URLs everywhere.
  return url.replace(/\/$/, '')
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
