import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { createSlugDeduper } from './slugify'

export type HeadingEntry = {
  id: string
  text: string
  level: 2 | 3
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
 * Walks the post's Lexical document for h2/h3 headings, for the table of
 * contents. Only two levels — deeper headings read as noise in a jump-link
 * list, matching most "on this page" widgets.
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
      if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
        const text = nodeText(node).trim()
        if (text) {
          headings.push({ id: nextId(text), text, level: node.tag === 'h2' ? 2 : 3 })
        }
      }
      if (node.children) walk(node.children)
    }
  }

  walk(root.children)
  return headings
}
