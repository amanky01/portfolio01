import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className, hover = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'surface-card rounded-xl p-6',
        hover && 'hover:border-[var(--accent)]/25',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
