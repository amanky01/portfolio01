'use client'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'
import { useProfileData } from '@/hooks/useProfileData'
import { Badge } from '@/components/ui'

export default function Footer() {
  const { profile } = useProfileData()

  const ensureAbsoluteUrl = (url: string | undefined) => {
    if (!url) return undefined
    if (url.startsWith('http') || url.startsWith('mailto:')) return url
    return `https://${url}`
  }

  const socials = [
    { href: ensureAbsoluteUrl(profile.github), icon: FaGithub, label: 'GitHub' },
    { href: ensureAbsoluteUrl(profile.linkedin), icon: FaLinkedin, label: 'LinkedIn' },
    { href: ensureAbsoluteUrl(profile.twitter), icon: FaTwitter, label: 'Twitter' },
    { href: profile.email ? `mailto:${profile.email}` : undefined, icon: FaEnvelope, label: 'Email' },
  ].filter((s) => s.href)

  return (
    <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-semibold text-[var(--text)] text-lg mb-2">
              {profile.name || 'Aman Kumar Yadav'}
            </p>
            <p className="text-[var(--text-muted)] text-sm mb-4">
              {profile.tagline || 'AI · ML · Computer Vision'}
            </p>
            {profile.bio?.trim() && (
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                {profile.bio.trim()}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-4">Navigation</p>
            <div className="flex flex-col gap-2">
              {[
                ['/', 'Home'],
                ['/projects', 'Projects'],
                ['/blog', 'Blog'],
                ['/contact', 'Contact'],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[var(--text-muted)] hover:text-[var(--accent)] text-sm transition-colors w-fit focus-ring rounded"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-4">Connect</p>
            <div className="flex gap-3 mb-6">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all focus-ring"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            {profile.email && (
              <p className="text-[var(--text-muted)] text-sm">{profile.email}</p>
            )}
            {profile.location && (
              <p className="text-[var(--text-muted)] text-sm mt-1">{profile.location}</p>
            )}
          </div>
        </div>

        {profile.availableForWork && (
          <div className="border-t border-[var(--border)] mt-10 pt-6 flex justify-center sm:justify-end">
            <Badge variant="success">Open to opportunities</Badge>
          </div>
        )}
      </div>
    </footer>
  )
}
