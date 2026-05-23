import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'outline'
  className?: string
}

const variants = {
  default: 'bg-white/5 text-[var(--text-muted)] border-[var(--border)]',
  accent: 'bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent)]/30',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  outline: 'bg-transparent text-[var(--text-muted)] border-[var(--border)]',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
