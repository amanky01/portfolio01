'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'
import { FaTimes, FaSave, FaEye, FaEdit, FaColumns } from 'react-icons/fa'
import { Button, Badge } from '@/components/ui'
import { cn, slugify } from '@/lib/utils'

export interface BlogFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string
  coverImage: string
  published: boolean
}

export const EMPTY_BLOG_FORM: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  tags: '',
  coverImage: '',
  published: false,
}

export function blogItemToForm(item: Record<string, unknown>): BlogFormData {
  return {
    title: String(item.title ?? ''),
    slug: String(item.slug ?? ''),
    excerpt: String(item.excerpt ?? ''),
    content: String(item.content ?? ''),
    tags: Array.isArray(item.tags) ? (item.tags as string[]).join(', ') : String(item.tags ?? ''),
    coverImage: String(item.coverImage ?? ''),
    published: Boolean(item.published),
  }
}

type ViewMode = 'write' | 'preview' | 'split'

const fieldClass =
  'w-full rounded-lg border border-[var(--border)] bg-white/[0.04] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]/50'

interface BlogEditorProps {
  mode: 'create' | 'edit'
  initialData: BlogFormData
  loadingContent?: boolean
  saving: boolean
  onSave: (data: BlogFormData) => void
  onClose: () => void
}

const VIEW_TABS: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
  { key: 'write', label: 'Write', icon: <FaEdit size={12} /> },
  { key: 'split', label: 'Split', icon: <FaColumns size={12} /> },
  { key: 'preview', label: 'Preview', icon: <FaEye size={12} /> },
]

function MarkdownPreview({ content, title, excerpt, tags }: Pick<BlogFormData, 'content' | 'title' | 'excerpt' | 'tags'>) {
  const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tagList.map(tag => (
              <Badge key={tag} variant="accent">{tag}</Badge>
            ))}
          </div>
        )}
        <h1 className="font-bold text-2xl md:text-3xl text-[var(--text)] mb-3 leading-tight">
          {title.trim() || 'Untitled post'}
        </h1>
        {excerpt.trim() && (
          <p className="text-sm text-[var(--text-muted)] mb-8 border-l-2 border-[var(--accent)]/40 pl-4">
            {excerpt}
          </p>
        )}
        <div className="prose-portfolio">
          {content.trim() ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <p className="text-[var(--text-muted)] italic">Start writing markdown to see a preview.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function BlogEditor({
  mode,
  initialData,
  loadingContent,
  saving,
  onSave,
  onClose,
}: BlogEditorProps) {
  const [form, setForm] = useState<BlogFormData>(initialData)
  const [viewMode, setViewMode] = useState<ViewMode>('split')

  useEffect(() => {
    setForm(initialData)
  }, [initialData])

  const set = <K extends keyof BlogFormData>(key: K, value: BlogFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const payload = { ...form }
    if (!payload.slug.trim() && payload.title.trim()) {
      payload.slug = slugify(payload.title)
    }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="flex-shrink-0 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl px-4 md:px-6 py-3">
        <div className="flex flex-wrap items-center gap-3 justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors"
              aria-label="Close editor"
            >
              <FaTimes size={14} />
            </button>
            <div className="min-w-0">
              <h2 className="font-semibold text-[var(--text)] truncate">
                {mode === 'edit' ? 'Edit blog post' : 'New blog post'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] hidden sm:block">
                Markdown editor with live preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded-lg border border-[var(--border)] p-0.5 bg-white/[0.02]">
              {VIEW_TABS.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setViewMode(tab.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    viewMode === tab.key
                      ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  )}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <Button onClick={handleSave} disabled={saving || loadingContent} variant="primary" size="sm">
              <FaSave size={11} /> {saving ? 'Saving...' : 'Publish / Save'}
            </Button>
          </div>
        </div>
      </header>

      {loadingContent ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[var(--text-muted)] animate-pulse">Loading post content...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden max-w-[1600px] mx-auto w-full">
          {/* Metadata sidebar */}
          <aside className="flex-shrink-0 lg:w-80 border-b lg:border-b-0 lg:border-r border-[var(--border)] overflow-y-auto p-4 md:p-5 space-y-4 bg-[var(--surface)]/40">
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1.5">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Post title"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1.5">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => set('slug', e.target.value)}
                placeholder="auto-from-title"
                className={cn(fieldClass, 'font-mono text-xs')}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1.5">Excerpt *</label>
              <textarea
                value={form.excerpt}
                onChange={e => set('excerpt', e.target.value)}
                rows={3}
                placeholder="Short summary for the blog list"
                className={cn(fieldClass, 'resize-y min-h-[72px]')}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1.5">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="AI, Python, Web Dev"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1.5">Cover image URL</label>
              <input
                type="text"
                value={form.coverImage}
                onChange={e => set('coverImage', e.target.value)}
                placeholder="Optional hero image"
                className={fieldClass}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => set('published', e.target.checked)}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              <span className="text-sm text-[var(--text)]">Published (visible on site)</span>
            </label>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2 border-t border-[var(--border)]">
              Use markdown for headings, lists, code blocks, and links. Preview updates as you type.
            </p>
          </aside>

          {/* Editor + preview */}
          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            <div
              className={cn(
                'flex-1 min-h-0 grid',
                viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
              )}
            >
              {(viewMode === 'write' || viewMode === 'split') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    'flex flex-col min-h-0 border-b lg:border-b-0',
                    viewMode === 'split' && 'lg:border-r border-[var(--border)]'
                  )}
                >
                  <div className="flex-shrink-0 px-4 py-2 border-b border-[var(--border)] bg-white/[0.02]">
                    <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                      Markdown
                    </span>
                  </div>
                  <textarea
                    value={form.content}
                    onChange={e => set('content', e.target.value)}
                    placeholder={'# Heading\n\nWrite your post in markdown...\n\n```js\nconsole.log("hello")\n```'}
                    className="flex-1 w-full min-h-[280px] lg:min-h-0 resize-none border-0 bg-transparent px-4 md:px-6 py-4 text-sm text-[var(--text)] font-mono leading-relaxed outline-none"
                    spellCheck={false}
                  />
                </motion.div>
              )}

              {(viewMode === 'preview' || viewMode === 'split') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col min-h-0 bg-white/[0.01]"
                >
                  <div className="flex-shrink-0 px-4 py-2 border-b border-[var(--border)] bg-white/[0.02]">
                    <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                      Preview
                    </span>
                  </div>
                  <MarkdownPreview
                    content={form.content}
                    title={form.title}
                    excerpt={form.excerpt}
                    tags={form.tags}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
