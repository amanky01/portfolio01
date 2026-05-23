import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="section-title">{title}</h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-[var(--text-muted)] text-base md:text-lg max-w-2xl',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
