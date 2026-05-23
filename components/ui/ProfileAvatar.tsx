'use client'
import { useEffect, useMemo, useState } from 'react'
import { cn, getImageEmbedCandidates, getInitials } from '@/lib/utils'

interface ProfileAvatarProps {
  src?: string
  name?: string
  className?: string
  imageClassName?: string
  size?: number
}

export function ProfileAvatar({
  src,
  name,
  className,
  imageClassName,
  size = 208,
}: ProfileAvatarProps) {
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
        'relative overflow-hidden rounded-2xl border border-[var(--border)] shadow-card bg-[var(--surface-elevated)] shrink-0',
        className
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        // Native img — more reliable than next/image for Google Drive redirects
        <img
          key={currentSrc}
          src={currentSrc}
          alt={name ? `${name} profile photo` : 'Profile photo'}
          referrerPolicy="no-referrer"
          className={cn('w-full h-full object-cover', imageClassName)}
          onError={handleError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span
            className="font-bold text-[var(--accent)]"
            style={{ fontSize: Math.max(size * 0.22, 24) }}
          >
            {getInitials(name)}
          </span>
        </div>
      )}
    </div>
  )
}
