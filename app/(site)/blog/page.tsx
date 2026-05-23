'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FloatingParticles from '@/components/animations/FloatingParticles'
import type { BlogPost } from '@/types'
import { SectionHeader, Card, Badge } from '@/components/ui'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPosts(d.data ?? [])
      })
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen pt-20 pb-20">
      {!reduceMotion && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
          <FloatingParticles />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="pt-8">
          <SectionHeader
            eyebrow="Writing"
            title="Blog"
            description="Thoughts on AI, ML, computer vision, and building things"
            align="center"
          />
        </motion.div>

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[var(--text-muted)]">Loading posts...</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <Card className="p-12 text-center">
            <p className="font-semibold text-xl text-[var(--accent)] mb-2">No posts yet</p>
            <p className="text-sm text-[var(--text-muted)]">
              Add posts via the admin panel to see them here.
            </p>
          </Card>
        )}

        {!loading && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <Card className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h2 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {post.title}
                      </h2>
                      <span className="text-xs text-[var(--text-muted)] whitespace-nowrap shrink-0">
                        {post.readTime} min read
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-sm text-[var(--accent)] group-hover:translate-x-0.5 transition-transform">
                        Read →
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
