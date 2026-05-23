'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FaLock, FaSignOutAlt, FaPlus, FaEdit, FaTrash,
  FaFolder, FaNewspaper, FaTools, FaBriefcase, FaEnvelope,
  FaTimes, FaSave, FaEye, FaEyeSlash, FaUser, FaBrain, FaUserSecret
} from 'react-icons/fa'
import { Button, ProfileAvatar } from '@/components/ui'
import { cn } from '@/lib/utils'

const adminFieldClass =
  'w-full rounded-lg border border-[var(--border)] bg-white/[0.04] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]/50'

/* ── Types ─────────────────────────────────────────────── */
type Tab = 'profile' | 'focus' | 'projects' | 'blogs' | 'skills' | 'experience' | 'messages' | 'privateNotes'

interface FormField { label: string; key: string; type: string; options?: string[] }

/* ── Reusable mini-components ──────────────────────────── */
const AdminField = ({
  label, value, onChange, type = 'text', options, required
}: {
  label: string; value: string | number | boolean; onChange: (v: string) => void
  type?: string; options?: string[]; required?: boolean
}) => (
  <div>
    <label className="text-sm font-medium text-[var(--text-muted)] block mb-1.5">
      {label}{required && <span className="text-[var(--accent)]"> *</span>}
    </label>
    {type === 'select' && options ? (
      <select value={String(value)} onChange={e => onChange(e.target.value)} className={cn(adminFieldClass, 'cursor-pointer')}>
        {options.map(o => <option key={o} value={o} className="bg-[var(--surface)]">{o}</option>)}
      </select>
    ) : type === 'textarea' ? (
      <textarea value={String(value)} onChange={e => onChange(e.target.value)} rows={4} className={cn(adminFieldClass, 'resize-y min-h-[100px]')} />
    ) : type === 'checkbox' ? (
      <div className="flex items-center gap-2 mt-1">
        <input type="checkbox" checked={value === 'true' || value === true}
          onChange={e => onChange(String(e.target.checked))}
          className="w-4 h-4 accent-[var(--accent)]" />
        <span className="text-sm text-[var(--text)]">Yes</span>
      </div>
    ) : (
      <input type={type} value={String(value)} onChange={e => onChange(e.target.value)} required={required} className={adminFieldClass} />
    )}
  </div>
)

/* ── CRUD Modal ──────────────────────────────────────────── */
function CrudModal({
  title, fields, data, onSave, onClose, loading
}: {
  title: string
  fields: FormField[]
  data: Record<string, unknown>
  onSave: (d: Record<string, unknown>) => void
  onClose: () => void
  loading: boolean
}) {
  const [form, setForm] = useState<Record<string, unknown>>({ ...data })

  const set = (k: string, v: string) => {
    setForm(prev => ({
      ...prev,
      [k]: v === 'true' ? true : v === 'false' ? false : v
    }))
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl p-6 surface-card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-[var(--text)]">{title}</h3>
          <button onClick={onClose} style={{ color: 'var(--dim)' }} className="hover:text-red-400 transition-colors">
            <FaTimes size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {fields.map(f => (
            <AdminField
              key={f.key}
              label={f.label}
              value={String(form[f.key] ?? '')}
              onChange={v => set(f.key, v)}
              type={f.type}
              options={f.options}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={() => onSave(form)} disabled={loading} variant="primary" className="flex-1">
            <FaSave size={12} /> {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Delete Confirm ─────────────────────────────────────── */
function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl p-6 w-80 text-center surface-card border-red-500/30"
      >
        <div className="text-3xl mb-3">⚠️</div>
        <p className="font-semibold text-[var(--text)] mb-2">Confirm delete</p>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button onClick={onConfirm} variant="primary" className="flex-1 !bg-red-500/20 !text-red-400 !border-red-500/40">
            Delete
          </Button>
          <Button onClick={onCancel} variant="secondary" className="flex-1">
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Profile Panel (single-record, no list) ─────────────── */
interface ProfileData {
  name: string; tagline: string; bio: string; email: string
  contactNumber: string; whatsapp: string; instagram: string
  github: string; linkedin: string; twitter: string; profileImage: string
  resumeUrl: string; location: string; availableForWork: boolean
  heroTypingTexts: string
  projectsCount: string
  technologiesCount: string
  yearOfStudy: string
  coffeeCups: string
}

const PROFILE_FIELDS: FormField[] = [
  { label: 'Full Name', key: 'name', type: 'text' },
  { label: 'Tagline / Title', key: 'tagline', type: 'text' },
  { label: 'Bio (2–3 sentences)', key: 'bio', type: 'textarea' },
  { label: 'Contact Email', key: 'email', type: 'email' },
  { label: 'Contact Number', key: 'contactNumber', type: 'text' },
  { label: 'WhatsApp (number or URL)', key: 'whatsapp', type: 'text' },
  { label: 'Instagram (URL or handle)', key: 'instagram', type: 'text' },
  { label: 'Location', key: 'location', type: 'text' },
  { label: 'GitHub URL', key: 'github', type: 'text' },
  { label: 'LinkedIn URL', key: 'linkedin', type: 'text' },
  { label: 'Twitter / X URL', key: 'twitter', type: 'text' },
  { label: 'Resume / CV URL', key: 'resumeUrl', type: 'text' },
  { label: 'Available for Work', key: 'availableForWork', type: 'checkbox' },
  { label: 'Hero Typing Texts (comma separated)', key: 'heroTypingTexts', type: 'text' },
  { label: 'Projects delivered (e.g. 12+)', key: 'projectsCount', type: 'text' },
  { label: 'Technologies (e.g. 20+)', key: 'technologiesCount', type: 'text' },
  { label: 'Years building (e.g. 3+)', key: 'yearOfStudy', type: 'text' },
  { label: 'Core domains (e.g. 4+)', key: 'coffeeCups', type: 'text' },
]

function ProfilePanel({ token }: { token: string | null }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: '', tagline: '', bio: '', email: '', contactNumber: '', whatsapp: '', instagram: '', github: '', linkedin: '',
    twitter: '', resumeUrl: '', profileImage: '', location: '', availableForWork: true, heroTypingTexts: '',
    projectsCount: '0', technologiesCount: '0', yearOfStudy: '', coffeeCups: '∞',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.profile) {
          const p = d.profile
          setProfile({
            name: p.name ?? '',
            tagline: p.tagline ?? '',
            bio: p.bio ?? '',
            email: p.email ?? '',
            contactNumber: p.contactNumber ?? '',
            whatsapp: p.whatsapp ?? '',
            instagram: p.instagram ?? '',
            github: p.github ?? '',
            linkedin: p.linkedin ?? '',
            twitter: p.twitter ?? '',
            profileImage: p.profileImage ?? '',
            resumeUrl: p.resumeUrl ?? '',
            location: p.location ?? '',
            availableForWork: p.availableForWork ?? true,
            heroTypingTexts: Array.isArray(p.heroTypingTexts) ? p.heroTypingTexts.join(', ') : (p.heroTypingTexts ?? ''),
            projectsCount: p.projectsCount ?? '0',
            technologiesCount: p.technologiesCount ?? '0',
            yearOfStudy: p.yearOfStudy ?? '',
            coffeeCups: p.coffeeCups ?? '∞',
          })
        }
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [token])

  const handleSave = async () => {
    setSaving(true)
    const body = {
      ...profile,
      heroTypingTexts: typeof profile.heroTypingTexts === 'string'
        ? profile.heroTypingTexts.split(',').map((s: string) => s.trim()).filter(Boolean)
        : profile.heroTypingTexts,
      availableForWork: Boolean(profile.availableForWork),
    }
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.success) {
        localStorage.setItem('profile_cache_bust', String(Date.now()))
        toast.success('Profile saved!')
      }
      else toast.error(d.error || 'Failed to save profile')
    } catch { toast.error('Network error') }
    finally { setSaving(false) }
  }

  const set = (k: string, v: string) => {
    setProfile(prev => ({
      ...prev,
      [k]: v === 'true' ? true : v === 'false' ? false : v,
    }))
  }

  if (loading) return (
    <div className="text-center py-20">
      <div className="text-sm text-[var(--text-muted)] animate-pulse">
        Loading profile...
      </div>
    </div>
  )

  return (
    <div className="rounded-xl p-6 surface-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-6 items-start p-4 rounded-lg border border-[var(--border)] bg-white/[0.02]">
          <ProfileAvatar src={profile.profileImage} name={profile.name} size={120} />
          <div className="flex-1 min-w-0">
            <AdminField
              label="Profile image URL"
              value={profile.profileImage}
              onChange={v => set('profileImage', v)}
              type="text"
            />
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
              Use a Google Drive share link set to &quot;Anyone with the link&quot;. Example:{' '}
              <code className="text-[var(--accent)]">https://drive.google.com/file/d/FILE_ID/view</code>
              . For best reliability, place a file at <code>/public/profile.jpg</code> and use{' '}
              <code>/profile.jpg</code>.
            </p>
          </div>
        </div>
        {PROFILE_FIELDS.map(f => (
          <div key={f.key} className={f.type === 'textarea' || f.key === 'heroTypingTexts' ? 'md:col-span-2' : ''}>
            <AdminField
              label={f.label}
              value={String(profile[f.key as keyof ProfileData] ?? '')}
              onChange={v => set(f.key, v)}
              type={f.type}
              options={f.options}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} variant="primary" size="lg">
          <FaSave size={12} /> {saving ? 'Saving...' : 'Save profile'}
        </Button>
      </div>
    </div>
  )
}

/* ── Tab config ─────────────────────────────────────────── */
const TAB_CONFIG: Record<Exclude<Tab, 'profile'>, {
  label: string; icon: React.ReactNode; color: string
  endpoint: string; deleteEndpoint?: (id: string) => string
  fields: FormField[]
  renderRow: (item: Record<string, unknown>) => React.ReactNode
  emptyForm: Record<string, unknown>
}> = {
  projects: {
    label: 'Projects', icon: <FaFolder />, color: '#00fff0',
    endpoint: '/api/projects',
    deleteEndpoint: (id) => `/api/projects/${id}`,
    emptyForm: { title: '', description: '', longDescription: '', category: 'AI', tags: '', techStack: '', github: '', demo: '', image: '', featured: false },
    fields: [
      { label: 'Title', key: 'title', type: 'text' },
      { label: 'Short description', key: 'description', type: 'textarea' },
      { label: 'Case study (markdown)', key: 'longDescription', type: 'textarea' },
      { label: 'Image URL (Drive or direct)', key: 'image', type: 'text' },
      { label: 'Category', key: 'category', type: 'select', options: ['AI', 'ML', 'CV', 'Web', 'Robotics', 'Other'] },
      { label: 'Tags (comma separated)', key: 'tags', type: 'text' },
      { label: 'Tech Stack (comma separated)', key: 'techStack', type: 'text' },
      { label: 'GitHub URL', key: 'github', type: 'text' },
      { label: 'Demo URL', key: 'demo', type: 'text' },
      { label: 'Featured', key: 'featured', type: 'checkbox' },
    ],
    renderRow: (item) => (
      <div>
        <div className="font-orbitron font-bold text-sm text-white">{String(item.title)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,255,240,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,255,240,0.2)' }}>
            {String(item.category)}
          </span>
          {Boolean(item.featured) && (
            <span className="font-mono-tech text-xs" style={{ color: 'var(--yellow)' }}>★ Featured</span>
          )}
        </div>
      </div>
    ),
  },
  blogs: {
    label: 'Blog Posts', icon: <FaNewspaper />, color: '#ff00ff',
    endpoint: '/api/blogs',
    deleteEndpoint: (id) => `/api/blogs/${id}`,
    emptyForm: { title: '', slug: '', excerpt: '', content: '', tags: '', published: false },
    fields: [
      { label: 'Title', key: 'title', type: 'text' },
      { label: 'Slug (auto-generated if empty)', key: 'slug', type: 'text' },
      { label: 'Excerpt', key: 'excerpt', type: 'textarea' },
      { label: 'Content (Markdown)', key: 'content', type: 'textarea' },
      { label: 'Tags (comma separated)', key: 'tags', type: 'text' },
      { label: 'Published', key: 'published', type: 'checkbox' },
    ],
    renderRow: (item) => (
      <div>
        <div className="font-orbitron font-bold text-sm text-white">{String(item.title)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>{String(item.slug)}</span>
          <span className={`font-mono-tech text-xs px-2 py-0.5 rounded-full ${Boolean(item.published) ? 'text-green-400' : 'text-yellow-400'}`}
            style={{ background: Boolean(item.published) ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,0,0.1)' }}>
            {Boolean(item.published) ? '● LIVE' : '○ DRAFT'}
          </span>
        </div>
      </div>
    ),
  },
  skills: {
    label: 'Skills', icon: <FaTools />, color: '#00ff88',
    endpoint: '/api/skills',
    emptyForm: { name: '', category: 'AI/ML', level: 75 },
    fields: [
      { label: 'Skill Name', key: 'name', type: 'text' },
      { label: 'Category', key: 'category', type: 'select', options: ['AI/ML', 'Web Dev', 'Robotics', 'Computer Vision', 'Languages', 'Tools'] },
      { label: 'Level (0-100)', key: 'level', type: 'number' },
    ],
    renderRow: (item) => (
      <div className="flex items-center gap-4 flex-1">
        <span className="font-orbitron font-bold text-sm text-white">{String(item.name)}</span>
        <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>{String(item.category)}</span>
        <div className="flex-1 h-1 rounded-full ml-auto max-w-24" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full" style={{ width: `${item.level}%`, background: 'var(--green)' }} />
        </div>
        <span className="font-orbitron text-xs font-bold" style={{ color: 'var(--green)' }}>{String(item.level)}%</span>
      </div>
    ),
  },
  experience: {
    label: 'Experience', icon: <FaBriefcase />, color: '#ffff00',
    endpoint: '/api/experience',
    emptyForm: { title: '', organization: '', type: 'Education', startDate: '', endDate: '', current: false, description: '', location: '' },
    fields: [
      { label: 'Title / Role', key: 'title', type: 'text' },
      { label: 'Organization', key: 'organization', type: 'text' },
      { label: 'Type', key: 'type', type: 'select', options: ['Education', 'Work', 'Internship', 'Project', 'Achievement'] },
      { label: 'Start Date (e.g. 2022-08)', key: 'startDate', type: 'text' },
      { label: 'End Date (leave empty if current)', key: 'endDate', type: 'text' },
      { label: 'Currently ongoing', key: 'current', type: 'checkbox' },
      { label: 'Description', key: 'description', type: 'textarea' },
      { label: 'Location', key: 'location', type: 'text' },
    ],
    renderRow: (item) => (
      <div>
        <div className="font-orbitron font-bold text-sm text-white">{String(item.title)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>{String(item.organization)}</span>
          <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,0,0.1)', color: 'var(--yellow)', border: '1px solid rgba(255,255,0,0.2)' }}>
            {String(item.type)}
          </span>
          {Boolean(item.current) && (
            <span className="font-mono-tech text-xs flex items-center gap-1" style={{ color: 'var(--green)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Current
            </span>
          )}
        </div>
      </div>
    ),
  },
  focus: {
    label: 'Focus Areas', icon: <FaBrain />, color: '#00fff0',
    endpoint: '/api/focus-areas',
    deleteEndpoint: (id) => `/api/focus-areas/${id}`,
    emptyForm: { title: '', description: '', icon: 'brain', color: 'var(--cyan)', order: 0 },
    fields: [
      { label: 'Title', key: 'title', type: 'text' },
      { label: 'Description', key: 'description', type: 'text' },
      { label: 'Icon (brain | eye | code | robot)', key: 'icon', type: 'text' },
      { label: 'Color (hex or var)', key: 'color', type: 'text' },
      { label: 'Order Index', key: 'order', type: 'number' },
    ],
    renderRow: (item) => (
      <div className="flex items-center gap-4 flex-1">
        <span className="font-orbitron font-bold text-sm text-white">{String(item.title)}</span>
        <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>{String(item.icon)}</span>
        <span className="font-mono-tech text-xs ml-auto" style={{ color: String(item.color || 'var(--cyan)') }}>{String(item.color || 'var(--cyan)')}</span>
      </div>
    ),
  },
  messages: {
    label: 'Messages', icon: <FaEnvelope />, color: '#ff6600',
    endpoint: '/api/contact',
    emptyForm: {},
    fields: [],
    renderRow: (item) => (
      <div>
        <div className="flex items-center gap-2">
          <span className="font-orbitron font-bold text-sm text-white">{String(item.name)}</span>
          <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>&lt;{String(item.email)}&gt;</span>
        </div>
        <div className="font-mono-tech text-xs mt-1" style={{ color: 'var(--text)' }}>{String(item.subject)}</div>
      </div>
    ),
  },
  privateNotes: {
    label: 'Private Notes', icon: <FaUserSecret />, color: '#f97316',
    endpoint: '/api/private-notes',
    deleteEndpoint: (id) => `/api/private-notes/${id}`,
    emptyForm: { title: '', topic: '', content: '', keywords: '', enabled: true },
    fields: [
      { label: 'Title', key: 'title', type: 'text' },
      { label: 'Topic (e.g. internship_story)', key: 'topic', type: 'text' },
      { label: 'Keywords (comma separated)', key: 'keywords', type: 'text' },
      { label: 'Content', key: 'content', type: 'textarea' },
      { label: 'Enabled for Chatbot', key: 'enabled', type: 'checkbox' },
    ],
    renderRow: (item) => (
      <div>
        <div className="font-orbitron font-bold text-sm text-white">{String(item.title)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.35)' }}>
            {String(item.topic)}
          </span>
          <span className={`font-mono-tech text-xs ${Boolean(item.enabled) ? 'text-green-400' : 'text-yellow-400'}`}>
            {Boolean(item.enabled) ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    ),
  },
}

/* ── Sidebar ────────────────────────────────────────────── */
const SIDEBAR_TABS: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'profile',    label: 'Profile',     icon: <FaUser />,      color: '#a78bfa' },
  { key: 'focus',      label: 'Focus Areas', icon: <FaBrain />,     color: '#38bdf8' },
  { key: 'projects',   label: 'Projects',    icon: <FaFolder />,    color: '#38bdf8' },
  { key: 'blogs',      label: 'Blog Posts',  icon: <FaNewspaper />, color: '#a78bfa' },
  { key: 'skills',     label: 'Skills',      icon: <FaTools />,     color: '#34d399' },
  { key: 'experience', label: 'Experience',  icon: <FaBriefcase />, color: '#fbbf24' },
  { key: 'messages',   label: 'Messages',    icon: <FaEnvelope />,  color: '#f472b6' },
  { key: 'privateNotes', label: 'Private Notes', icon: <FaUserSecret />, color: '#f97316' },
]

function Sidebar({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col gap-1 py-4 pr-4">
      <div className="mb-6 px-2">
        <div className="font-semibold text-sm text-[var(--accent)]">
          Admin panel
        </div>
        <div className="text-xs mt-1 text-[var(--text-muted)]">aman@portfolio.dev</div>
      </div>
      {SIDEBAR_TABS.map(({ key, label, icon, color }) => {
        const isActive = active === key
        return (
          <button key={key} onClick={() => setActive(key)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 w-full"
            style={{
              background: isActive ? `${color}12` : 'transparent',
              border: `1px solid ${isActive ? color : 'transparent'}`,
              color: isActive ? color : 'var(--dim)',
              boxShadow: isActive ? `0 0 12px ${color}22` : 'none',
            }}>
            <span style={{ fontSize: 13 }}>{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        )
      })}
    </aside>
  )
}

/* ── Main Admin Page ────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  const [modal, setModal] = useState<{
    open: boolean; mode: 'create' | 'edit'; item?: Record<string, unknown>
  }>({ open: false, mode: 'create' })
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null)

  // Check existing auth
  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    if (t) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${t}` } })
        .then(r => r.json())
        .then(d => {
          if (d.success) { setToken(t); setAuthed(true) }
          else localStorage.removeItem('admin_token')
        })
        .catch(() => {})
        .finally(() => setChecking(false))
    } else { setChecking(false) }
  }, [])



  const fetchData = useCallback(async () => {
    if (!token || activeTab === 'profile') return
    setDataLoading(true)
    const cfg = TAB_CONFIG[activeTab as Exclude<Tab, 'profile'>]
    const url = activeTab === 'blogs' ? `${cfg.endpoint}?admin=true` : cfg.endpoint
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const d = await res.json()
      setItems(d.data ?? (d.success ? d.data : []) ?? [])
    } catch { setItems([]) }
    finally { setDataLoading(false) }
  }, [token, activeTab])

  useEffect(() => { if (authed && activeTab !== 'profile') fetchData() }, [authed, fetchData, activeTab])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const d = await res.json()
      if (d.success) {
        localStorage.setItem('admin_token', d.token)
        setToken(d.token)
        setAuthed(true)
        toast.success('Access granted.')
      } else {
        toast.error(d.error || 'Invalid credentials')
      }
    } catch { toast.error('Network error') }
    finally { setLoginLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setToken(null); setAuthed(false)
    toast.success('Logged out.')
  }

  const handleSave = async (formData: Record<string, unknown>) => {
    setSaveLoading(true)
    const cfg = TAB_CONFIG[activeTab as Exclude<Tab, 'profile'>]
    const body = { ...formData }
    if (typeof body.tags === 'string') body.tags = (body.tags as string).split(',').map(s => s.trim()).filter(Boolean)
    if (typeof body.techStack === 'string') body.techStack = (body.techStack as string).split(',').map(s => s.trim()).filter(Boolean)
    if (typeof body.keywords === 'string') body.keywords = (body.keywords as string).split(',').map(s => s.trim()).filter(Boolean)

    const isEdit = modal.mode === 'edit' && modal.item?._id
    const url = isEdit && cfg.deleteEndpoint
      ? cfg.deleteEndpoint(String(modal.item!._id))
      : cfg.endpoint
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.success) {
        toast.success(isEdit ? 'Updated!' : 'Created!')
        setModal({ open: false, mode: 'create' })
        fetchData()
      } else {
        toast.error(d.error || 'Failed to save')
      }
    } catch { toast.error('Network error') }
    finally { setSaveLoading(false) }
  }

  const handleDelete = async (id: string) => {
    const cfg = TAB_CONFIG[activeTab as Exclude<Tab, 'profile'>]
    if (!cfg.deleteEndpoint) return
    try {
      const res = await fetch(cfg.deleteEndpoint(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const d = await res.json()
      if (d.success) { toast.success('Deleted!'); fetchData() }
      else toast.error('Failed to delete')
    } catch { toast.error('Network error') }
    finally { setDeleteTarget(null) }
  }

  // ── Loading screen ──
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-sm text-[var(--text-muted)] animate-pulse">
          Verifying access...
        </div>
      </div>
    )
  }

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/30">
              <FaLock size={20} />
            </div>
            <h1 className="font-bold text-xl text-[var(--text)]">Admin access</h1>
            <p className="text-sm mt-2 text-[var(--text-muted)]">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleLogin} className="surface-card rounded-xl p-6 space-y-4">
            <AdminField label="Email" value={email} onChange={setEmail} type="email" required />
            <div>
              <label className="text-sm font-medium text-[var(--text-muted)] block mb-1.5">
                Password <span className="text-[var(--accent)]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className={cn(adminFieldClass, 'pr-10')}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  {showPass ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loginLoading} variant="primary" size="lg" className="w-full mt-2">
              {loginLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </motion.div>
      </div>
    )
  }

  // ── Dashboard ──
  const isProfileTab = activeTab === 'profile'
  const cfg = !isProfileTab ? TAB_CONFIG[activeTab as Exclude<Tab, 'profile'>] : null
  const tabMeta = SIDEBAR_TABS.find(t => t.key === activeTab)!

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-60 z-30 pt-16 px-4 flex flex-col bg-[var(--surface)]/95 border-r border-[var(--border)] backdrop-blur-xl">
        <Sidebar active={activeTab} setActive={(t) => { setActiveTab(t); setItems([]) }} />
        <button onClick={handleLogout}
          className="mt-auto mb-6 flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-red-400/80 border border-red-500/20 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <FaSignOutAlt size={12} /> Logout
        </button>
      </div>

      {/* Main content */}
      <div className="ml-60 flex-1 pt-16 p-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Tab header */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <div className="flex items-center gap-3">
                <span style={{ color: tabMeta.color, fontSize: 18 }}>{tabMeta.icon}</span>
                <h1 className="font-bold text-lg" style={{ color: tabMeta.color }}>
                  {tabMeta.label}
                </h1>
                {!isProfileTab && (
                  <span className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ background: `${tabMeta.color}12`, color: tabMeta.color, borderColor: `${tabMeta.color}30` }}>
                    {items.length}
                  </span>
                )}
              </div>
              <p className="text-xs mt-1 text-[var(--text-muted)]">
                {isProfileTab ? 'Edit your public profile' : `Manage ${activeTab}`}
              </p>
            </div>
            {!isProfileTab && cfg && activeTab !== 'messages' && (
              <Button
                onClick={() => setModal({ open: true, mode: 'create' })}
                variant="outline"
                size="sm"
              >
                <FaPlus size={11} /> New
              </Button>
            )}
          </motion.div>

          {/* Profile panel */}
          {isProfileTab && <ProfilePanel token={token} />}

          {/* List panel */}
          {!isProfileTab && cfg && (
            dataLoading ? (
              <div className="text-center py-20">
                <div className="text-sm text-[var(--text-muted)] animate-pulse">
                  Loading {activeTab}...
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 rounded-xl surface-card">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm text-[var(--text-muted)]">
                  No {activeTab} found. {activeTab !== 'messages' && 'Create your first one!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <motion.div
                    key={String(item._id ?? idx)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="rounded-xl p-4 flex items-center gap-4 surface-card"
                  >
                    <div className="flex-1 min-w-0">
                      {cfg.renderRow(item)}
                      {activeTab === 'messages' && expandedMsg === String(item._id) && (
                        <p className="text-sm mt-3 leading-relaxed text-[var(--text-muted)] bg-white/[0.03] p-3 rounded-lg border-l-2 border-[var(--accent)]">
                          {String(item.message)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {activeTab === 'messages' ? (
                        <button
                          onClick={() => setExpandedMsg(expandedMsg === String(item._id) ? null : String(item._id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--accent)] hover:bg-white/5 transition-all">
                          <FaEye size={12} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const formItem: Record<string, unknown> = { ...item }
                            if (Array.isArray(formItem.tags)) formItem.tags = (formItem.tags as string[]).join(', ')
                            if (Array.isArray(formItem.techStack)) formItem.techStack = (formItem.techStack as string[]).join(', ')
                            if (Array.isArray(formItem.keywords)) formItem.keywords = (formItem.keywords as string[]).join(', ')
                            setModal({ open: true, mode: 'edit', item: formItem })
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--accent)] hover:bg-white/5 transition-all">
                          <FaEdit size={12} />
                        </button>
                      )}
                      {cfg.deleteEndpoint && (
                        <button
                          onClick={() => setDeleteTarget(String(item._id))}
                          className="w-8 h-8 flex items-center justify-center rounded transition-all hover:scale-110"
                          style={{ color: 'rgba(255,80,80,0.7)', border: '1px solid rgba(255,80,80,0.2)' }}>
                          <FaTrash size={11} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {modal.open && cfg && (
          <CrudModal
            title={`${modal.mode === 'edit' ? 'Edit' : 'New'} ${tabMeta.label.replace(/s$/, '')}`}
            fields={cfg.fields}
            data={modal.mode === 'edit' && modal.item ? modal.item : cfg.emptyForm}
            onSave={handleSave}
            onClose={() => setModal({ open: false, mode: 'create' })}
            loading={saveLoading}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirm
            onConfirm={() => handleDelete(deleteTarget)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
