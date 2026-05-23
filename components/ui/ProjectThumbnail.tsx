'use client'
import { useState } from 'react'
import Image from 'next/image'
import { cn, getDirectImageUrl } from '@/lib/utils'

interface ProjectThumbnailProps {
  src?: string
  title: string
  categoryColor?: string
  className?: string
  aspect?: 'video' | 'square'
}

export function ProjectThumbnail({
  src,
  title,
  categoryColor = '#38bdf8',
  className,
  aspect = 'video',
}: ProjectThumbnailProps) {
  const [failed, setFailed] = useState(false)
  const resolved = getDirectImageUrl(src)
  const showImage = Boolean(resolved) && !failed

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--surface-elevated)]',
        aspect === 'video' ? 'aspect-video' : 'aspect-square',
        className
      )}
    >
      {showImage ? (
        <Image
          src={resolved}
          alt={title}
          fill
          unoptimized
          referrerPolicy="no-referrer"
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${categoryColor}18, transparent 60%)`,
          }}
        >
          <span className="text-3xl font-bold opacity-30" style={{ color: categoryColor }}>
            {title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ background: `linear-gradient(90deg, ${categoryColor}, transparent)` }}
      />
    </div>
  )
}
