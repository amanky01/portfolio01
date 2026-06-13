'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { FaComment } from 'react-icons/fa'
import { Button, Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlogComment } from '@/types'

const fieldClass =
  'w-full rounded-lg border border-[var(--border)] bg-white/[0.04] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-ring focus:border-[var(--accent)]/50 outline-none transition-colors'

interface BlogCommentsProps {
  blogSlug: string
}

export function BlogComments({ blogSlug }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', body: '', website: '' })

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs/${blogSlug}/comments`)
      const d = await res.json()
      if (d.success) setComments(d.data ?? [])
    } catch {
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [blogSlug])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/blogs/${blogSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (d.success) {
        toast.success(d.message || 'Comment submitted!')
        setForm({ name: '', email: '', body: '', website: '' })
      } else {
        toast.error(d.error || 'Failed to submit comment')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12 pt-10 border-t border-[var(--border)]">
      <div className="flex items-center gap-2 mb-6">
        <FaComment className="text-[var(--accent)]" size={16} />
        <h2 className="font-semibold text-lg text-[var(--text)]">
          Comments{comments.length > 0 ? ` (${comments.length})` : ''}
        </h2>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)] animate-pulse mb-8">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] mb-8">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="space-y-4 mb-10">
          {comments.map((comment) => (
            <li key={comment._id}>
              <Card className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-medium text-sm text-[var(--text)]">{comment.name}</p>
                    <time
                      className="text-xs text-[var(--text-muted)]"
                      dateTime={comment.createdAt}
                    >
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Card className="p-6">
        <h3 className="font-medium text-[var(--text)] mb-4">Leave a comment</h3>
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                maxLength={80}
                className={fieldClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1.5">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                maxLength={120}
                className={fieldClass}
                placeholder="you@example.com"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">Not displayed publicly.</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] block mb-1.5">Comment *</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              required
              maxLength={2000}
              rows={4}
              className={cn(fieldClass, 'resize-y min-h-[100px]')}
              placeholder="Share your thoughts..."
            />
          </div>
          {/* Honeypot — hidden from users, bots often fill it */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            tabIndex={-1}
            autoComplete="off"
            className="absolute opacity-0 pointer-events-none h-0 w-0"
            aria-hidden
          />
          <Button type="submit" disabled={submitting} variant="primary">
            {submitting ? 'Submitting...' : 'Post comment'}
          </Button>
          <p className="text-xs text-[var(--text-muted)]">
            Comments are moderated before they appear on the site.
          </p>
        </form>
      </Card>
    </section>
  )
}
