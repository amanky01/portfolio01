'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import NeuralNetCanvas from '@/components/animations/NeuralNetCanvas'
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaDownload } from 'react-icons/fa'
import { HiArrowDown } from 'react-icons/hi'
import { useProfileData } from '@/hooks/useProfileData'
import { Badge, Button, ProfileAvatar } from '@/components/ui'

export default function HeroSection() {
  const { profile } = useProfileData()

  const taglines = profile.heroTypingTexts?.length
    ? profile.heroTypingTexts
    : ['AI & ML Engineer', 'Computer Vision Developer']

  const [taglineIndex, setTaglineIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(taglines[0])
      return
    }
    const current = taglines[taglineIndex % taglines.length]
    const speed = isDeleting ? 40 : 80

    timeoutRef.current = setTimeout(() => {
      if (!isDeleting && displayed.length < current.length) {
        setDisplayed(current.slice(0, displayed.length + 1))
      } else if (!isDeleting && displayed.length === current.length) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && displayed.length > 0) {
        setDisplayed(current.slice(0, displayed.length - 1))
      } else {
        setIsDeleting(false)
        setTaglineIndex((i) => (i + 1) % taglines.length)
      }
    }, speed)

    return () => clearTimeout(timeoutRef.current)
  }, [displayed, isDeleting, taglineIndex, taglines, reduceMotion])

  const ensureAbsoluteUrl = (url: string | undefined) => {
    if (!url) return undefined
    if (url.startsWith('http')) return url
    return `https://${url}`
  }

  const toWhatsappHref = (value: string | undefined) => {
    if (!value) return undefined
    if (value.startsWith('http')) return value
    const digitsOnly = value.replace(/\D/g, '')
    return digitsOnly ? `https://wa.me/${digitsOnly}` : undefined
  }

  const socials = [
    { icon: <FaGithub size={18} />, href: ensureAbsoluteUrl(profile.github), label: 'GitHub' },
    { icon: <FaLinkedin size={18} />, href: ensureAbsoluteUrl(profile.linkedin), label: 'LinkedIn' },
    { icon: <FaWhatsapp size={18} />, href: toWhatsappHref(profile.whatsapp), label: 'WhatsApp' },
    { icon: <FaEnvelope size={18} />, href: profile.email ? `mailto:${profile.email}` : undefined, label: 'Email' },
  ].filter((s) => s.href)

  const displayName = profile.name || 'Aman Kumar Yadav'
  const nameParts = displayName.split(' ')
  const firstName = nameParts[0] ?? ''
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : nameParts[1] ?? ''
  const lastName = nameParts.length > 2 ? nameParts[nameParts.length - 1] : ''

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
      {!reduceMotion && (
        <div className="absolute inset-0 z-0">
          <NeuralNetCanvas />
        </div>
      )}

      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <ProfileAvatar
            src={profile.profileImage}
            name={profile.name}
            size={96}
            className="rounded-full"
            imageClassName="rounded-full"
          />
        </motion.div>

        {profile.availableForWork && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge variant="success">Available for work</Badge>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4"
        >
          <h1
            className="font-bold leading-tight tracking-tight text-[var(--text)]"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}
          >
            {firstName}{' '}
            <span className="text-[var(--accent)]">{middleName}</span>
            {lastName ? ` ${lastName}` : ''}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 h-8 flex items-center justify-center"
        >
          <span className="font-mono text-lg md:text-xl text-[var(--text-muted)]">
            {displayed}
            {!reduceMotion && <span className="typing-cursor" />}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[var(--text-muted)] text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {profile.tagline ||
            (profile.bio
              ? profile.bio.split('\n')[0]
              : 'I design and ship intelligent systems — from computer vision pipelines to production-ready AI web applications.')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <Link href="/projects">
            <Button variant="primary" size="lg">
              View projects
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Get in touch
            </Button>
          </Link>
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="lg">
                <FaDownload size={14} /> Resume
              </Button>
            </a>
          )}
        </motion.div>

        {socials.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            {socials.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all focus-ring"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </motion.div>
        )}

        <motion.div
          animate={reduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[var(--text-muted)]">Scroll</span>
          <HiArrowDown className="text-[var(--accent)] opacity-50" />
        </motion.div>
      </div>
    </section>
  )
}
