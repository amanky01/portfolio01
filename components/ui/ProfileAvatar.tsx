'use client'
import { useState } from 'react'
import Image from 'next/image'
import { cn, getDirectImageUrl, getInitials } from '@/lib/utils'

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
  const [failed, setFailed] = useState(false)
  const resolved = getDirectImageUrl(src)
  const showImage = Boolean(resolved) && !failed

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[var(--border)] shadow-card bg-[var(--surface-elevated)] shrink-0',
        className
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <Image
          src={resolved}
          alt={name ? `${name} profile photo` : 'Profile photo'}
          fill
          unoptimized
          referrerPolicy="no-referrer"
          className={cn('object-cover', imageClassName)}
          sizes={`${size}px`}
          onError={() => setFailed(true)}
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
