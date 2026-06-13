const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 120
}

export function sanitizeCommentInput(body: {
  name?: unknown
  email?: unknown
  body?: unknown
  website?: unknown
}): { ok: true; data: { name: string; email: string; body: string } } | { ok: false; error: string } {
  if (typeof body.website === 'string' && body.website.trim()) {
    return { ok: false, error: 'Invalid submission' }
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const text = typeof body.body === 'string' ? body.body.trim() : ''

  if (!name || name.length > 80) return { ok: false, error: 'Name is required (max 80 characters)' }
  if (!email || !isValidEmail(email)) return { ok: false, error: 'A valid email is required' }
  if (!text || text.length > 2000) return { ok: false, error: 'Comment is required (max 2000 characters)' }

  return { ok: true, data: { name, email, body: text } }
}
