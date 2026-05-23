'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaDownload } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import { useProfileData } from '@/hooks/useProfileData'
import { Button } from '@/components/ui'

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { profile } = useProfileData()

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handle)
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 group focus-ring rounded-lg">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center">
            <span className="font-semibold text-[var(--accent)] text-sm">A</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-semibold text-[var(--text)] text-sm leading-none">Aman Kumar</p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">AI · ML · CV</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors focus-ring',
                  active
                    ? 'text-[var(--accent)] bg-[var(--accent-muted)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            )
          })}
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="ml-2">
              <Button variant="primary" size="sm">
                <FaDownload size={12} /> Resume
              </Button>
            </a>
          )}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus-ring rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              'w-6 h-0.5 bg-[var(--text-muted)] transition-all',
              menuOpen && 'rotate-45 translate-y-2'
            )}
          />
          <span
            className={cn('w-6 h-0.5 bg-[var(--text-muted)] transition-all', menuOpen && 'opacity-0')}
          />
          <span
            className={cn(
              'w-6 h-0.5 bg-[var(--text-muted)] transition-all',
              menuOpen && '-rotate-45 -translate-y-2'
            )}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--border)]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'block px-6 py-4 text-sm font-medium border-b border-[var(--border)] transition-colors',
                pathname === link.href
                  ? 'text-[var(--accent)] bg-[var(--accent-muted)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              )}
            >
              {link.label}
            </Link>
          ))}
          {profile.resumeUrl && (
            <div className="px-6 py-4">
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="primary" size="md" className="w-full">
                  <FaDownload size={12} /> Download resume
                </Button>
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
