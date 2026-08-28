import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { createSlugDeduper } from './slugify'

export type HeadingEntry = {
  id: string
  text: string
}

export type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
}

/** Concatenates the plain text of a node's descendants — a heading's
 * "children" are text/bold/italic/link nodes, not a single string. Exported
 * for RichText's heading converter, which needs the same extraction to stamp
 * a matching `id` on the rendered heading. */
export function nodeText(node: LexicalNode): string {
  if (typeof node.text === 'string') return node.text
  if (!node.children) return ''
  return node.children.map(nodeText).join('')
}

/**
 * Walks the post's Lexical document for h2 headings, for the table of
 * contents — top-level sections only, all rendered at the same flat level.
 * H3/H4 read as noise in a jump-link list, matching most "on this page"
 * widgets.
 *
 * Slugs are deduplicated by appending `-2`, `-3`, ... on repeats, so two
 * identically-worded headings ("Overview" in two sections) still get
 * distinct anchors. RichText's heading converter runs the same de-duplication
 * in the same document order, so the two stay in sync.
 */
export function extractHeadings(content: DefaultTypedEditorState | null | undefined): HeadingEntry[] {
  const root = (content as { root?: { children?: LexicalNode[] } } | null | undefined)?.root
  if (!root?.children) return []

  const nextId = createSlugDeduper()
  const headings: HeadingEntry[] = []

  const walk = (nodes: LexicalNode[]) => {
    for (const node of nodes) {
      if (node.type === 'heading' && node.tag === 'h2') {
        const text = nodeText(node).trim()
        if (text) {
          headings.push({ id: nextId(text), text })
        }
      }
      if (node.children) walk(node.children)
    }
  }

  walk(root.children)
  return headings
}
