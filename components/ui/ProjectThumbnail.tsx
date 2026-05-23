'use client'
import { useEffect, useMemo, useState } from 'react'
import { cn, getImageEmbedCandidates } from '@/lib/utils'

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
  const candidates = useMemo(() => getImageEmbedCandidates(src), [src])
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setCandidateIndex(0)
    setFailed(false)
  }, [src])

  const currentSrc = candidates[candidateIndex]
  const showImage = Boolean(currentSrc) && !failed

  const handleError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex((i) => i + 1)
    } else {
      setFailed(true)
    }
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--surface-elevated)]',
        aspect === 'video' ? 'aspect-video' : 'aspect-square',
        className
      )}
    >
      {showImage ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={handleError}
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
