import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export const CATEGORY_COLORS: Record<string, string> = {
  'AI': '#38bdf8',
  'ML': '#a78bfa',
  'Robotics': '#fbbf24',
  'Web': '#34d399',
  'CV': '#f472b6',
  'Other': '#94a3b8',
}

export const SKILL_CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': '#38bdf8',
  'Web Dev': '#34d399',
  'Robotics': '#fbbf24',
  'Computer Vision': '#a78bfa',
  'Languages': '#f472b6',
  'Tools': '#94a3b8',
}

/** Extract Google Drive file ID from common share/embed URL formats */
export function extractGoogleDriveFileId(url: string): string | null {
  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?(?:export=view&)?id=([a-zA-Z0-9_-]+)/,
    /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

/** Normalize external image URLs (Google Drive, relative paths) for embedding */
export function getDirectImageUrl(url: string | undefined): string {
  const trimmed = url?.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('/')) return trimmed

  const driveId = extractGoogleDriveFileId(trimmed)
  if (driveId) {
    return `https://drive.google.com/uc?export=view&id=${driveId}&sz=w800`
  }

  return trimmed
}

export function getInitials(name: string | undefined, max = 2): string {
  if (!name?.trim()) return 'AK'
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, max)
    .toUpperCase()
}
