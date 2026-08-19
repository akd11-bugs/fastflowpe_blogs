type LexicalNode = {
  text?: string
  children?: LexicalNode[]
}

function extractText(node: LexicalNode | undefined): string {
  if (!node) return ''
  const ownText = node.text || ''
  const childText = Array.isArray(node.children)
    ? node.children.map(extractText).join(' ')
    : ''
  return `${ownText} ${childText}`
}

/**
 * Estimates reading time (in whole minutes, minimum 1) from a Lexical richText document.
 */
export function getReadingTime(content: unknown, wordsPerMinute = 200): number {
  try {
    const root = (content as { root?: LexicalNode })?.root
    if (!root) return 1
    const text = extractText(root)
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  } catch {
    return 1
  }
}
