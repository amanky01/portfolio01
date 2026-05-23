'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NeuralNetCanvas from '@/components/animations/NeuralNetCanvas'
import toast from 'react-hot-toast'
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
} from 'react-icons/fa'
import { useProfileData } from '@/hooks/useProfileData'
import { SectionHeader, Card, Badge, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const fieldClass =
  'w-full rounded-lg border border-[var(--border)] bg-white/[0.04] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-ring focus:border-[var(--accent)]/50 outline-none transition-colors'

export default function ContactPage() {
  const { profile } = useProfileData()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const ensureAbsoluteUrl = (url: string | undefined) => {
    if (!url) return undefined
    if (url.startsWith('http') || url.startsWith('mailto:')) return url
    return `https://${url}`
  }

  const toPhoneHref = (value: string | undefined) => {
    if (!value) return undefined
    const cleaned = value.replace(/[^\d+]/g, '')
    return cleaned ? `tel:${cleaned}` : undefined
  }

  const toWhatsappHref = (value: string | undefined) => {
    if (!value) return undefined
    if (value.startsWith('http')) return value
    const digitsOnly = value.replace(/\D/g, '')
    return digitsOnly ? `https://wa.me/${digitsOnly}` : undefined
  }

  const toInstagramHref = (value: string | undefined) => {
    if (!value) return undefined
    if (value.startsWith('http')) return value
    const handle = value.startsWith('@') ? value.slice(1) : value
    return handle ? `https://instagram.com/${handle}` : undefined
  }

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: profile.email || 'Not provided',
      href: profile.email ? `mailto:${profile.email}` : null,
    },
    {
      icon: <FaPhone />,
      label: 'Phone',
      value: profile.contactNumber || 'Not provided',
      href: toPhoneHref(profile.contactNumber) || null,
    },
    {
      icon: <FaWhatsapp />,
      label: 'WhatsApp',
      value: profile.whatsapp || 'Not provided',
      href: toWhatsappHref(profile.whatsapp) || null,
    },
    {
      icon: <FaInstagram />,
      label: 'Instagram',
      value: profile.instagram || 'Not provided',
      href: toInstagramHref(profile.instagram) || null,
    },
    {
      icon: <FaGithub />,
      label: 'GitHub',
      value: profile.github || 'Not provided',
      href: ensureAbsoluteUrl(profile.github),
    },
    {
      icon: <FaLinkedin />,
      label: 'LinkedIn',
      value: profile.linkedin || 'Not provided',
      href: ensureAbsoluteUrl(profile.linkedin),
    },
    {
      icon: <FaMapMarkerAlt />,
      label: 'Location',
      value: profile.location || 'Remote',
      href: null,
    },
  ].filter((info) => info.value !== 'Not provided' || info.label === 'Email')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Message sent! I'll get back to you soon.")
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(data.error || 'Failed to send message')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-20 relative overflow-hidden">
      {!reduceMotion && (
        <div className="fixed inset-0 z-0 opacity-20">
          <NeuralNetCanvas />
          <div className="absolute inset-0 bg-[var(--bg)]/85" />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="pt-8">
          <SectionHeader
            eyebrow="Contact"
            title="Get in touch"
            description={
              profile.tagline
                ? `${profile.tagline} · Available for new opportunities`
                : 'Available for new opportunities'
            }
            align="center"
          />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <Card>
              <p className="text-sm font-medium text-[var(--text)] mb-2">Availability</p>
              {profile.availableForWork ? (
                <Badge variant="success" className="mb-3">
                  Open to opportunities
                </Badge>
              ) : (
                <Badge variant="outline" className="mb-3">
                  Not currently available
                </Badge>
              )}
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {profile.availableForWork
                  ? 'Currently seeking internships, research positions, and freelance projects.'
                  : 'Focused on current projects, but feel free to reach out for future collaborations.'}
              </p>
            </Card>

            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
              >
                {info.href ? (
                  <a href={info.href} target="_blank" rel="noopener noreferrer" className="block">
                    <Card className="p-4 flex items-center gap-4 group">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[var(--accent-muted)] text-[var(--accent)]">
                        {info.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-[var(--text-muted)] mb-0.5">{info.label}</div>
                        <div className="text-sm font-medium text-[var(--text)] truncate group-hover:text-[var(--accent)] transition-colors">
                          {info.value}
                        </div>
                      </div>
                    </Card>
                  </a>
                ) : (
                  <Card className="p-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[var(--accent-muted)] text-[var(--accent)]">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)] mb-0.5">{info.label}</div>
                      <div className="text-sm font-medium text-[var(--text)]">{info.value}</div>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="p-8">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-6">Send a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                      Name <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                      Email <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className={fieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                    Subject <span className="text-[var(--accent)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="What's this about?"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                    Message <span className="text-[var(--accent)]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell me about your project or opportunity..."
                    className={cn(fieldClass, 'resize-y min-h-[120px]')}
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send message'}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
