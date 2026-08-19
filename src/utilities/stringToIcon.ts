import {
  Cpu,
  GitBranch,
  LayoutGrid,
  Megaphone,
  Newspaper,
  Sparkles,
  TrendingUp,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const ICONS: LucideIcon[] = [Cpu, Sparkles, Megaphone, TrendingUp, LayoutGrid, GitBranch, Newspaper, Zap]

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Deterministic icon derived from a string, e.g. a category name.
 * Uses the same hashing approach as stringToColor so a given name's
 * icon and color pairing stays visually consistent wherever it's used.
 */
export function stringToIcon(input: string): LucideIcon {
  return ICONS[hashString(input) % ICONS.length]
}
