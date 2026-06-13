'use client'

import { ProjectThumbnail } from '@/components/ui'
import { cn } from '@/lib/utils'

interface BlogCoverImageProps {
  src?: string
  title: string
  className?: string
  aspect?: 'video' | 'wide'
}

/** Renders blog cover when `src` is set; no size requirement — any image URL works. */
export function BlogCoverImage({ src, title, className, aspect = 'video' }: BlogCoverImageProps) {
  if (!src?.trim()) return null

  return (
    <ProjectThumbnail
      src={src}
      title={title}
      aspect={aspect === 'wide' ? 'video' : 'video'}
      className={cn('rounded-xl', className)}
      categoryColor="#a78bfa"
    />
  )
}
