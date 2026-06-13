'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import FloatingParticles from '@/components/animations/FloatingParticles'
import type { BlogPost } from '@/types'
import { Card, Badge } from '@/components/ui'
import { BlogComments } from '@/components/blog/BlogComments'
import { BlogCoverImage } from '@/components/blog/BlogCoverImage'

const STATIC_POST: BlogPost = {
  _id: '1',
  title: 'Getting Started with YOLOv8 for Custom Object Detection',
  slug: 'yolov8-custom-object-detection',
  excerpt: 'A complete guide to training your first custom YOLOv8 model.',
  content: `## Introduction

YOLOv8 is the latest iteration of the YOLO (You Only Look Once) family of real-time object detectors, 
bringing significant improvements in accuracy and speed.

## Installation

\`\`\`bash
pip install ultralytics
\`\`\`

## Data Preparation

Before training, organize your dataset in the YOLO format.

## Training

\`\`\`python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
results = model.train(data='data.yaml', epochs=100, imgsz=640)
\`\`\`

## Conclusion

YOLOv8 makes custom object detection accessible and fast.`,
  tags: ['Computer Vision', 'YOLO', 'Python'],
  published: true,
  readTime: 8,
  createdAt: '2024-06-01',
  updatedAt: '2024-06-01',
}

export default function BlogSlugPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPost(d.data)
        else setPost(STATIC_POST)
      })
      .catch(() => setPost(STATIC_POST))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)] animate-pulse">Loading post...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-[var(--text-muted)]">Post not found</p>
        <Link href="/blog" className="text-sm text-[var(--accent)] hover:underline focus-ring rounded">
          ← Back to blog
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-20 relative overflow-hidden">
      {!reduceMotion && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
          <FloatingParticles />
        </div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] mb-8 transition-colors focus-ring rounded"
          >
            ← Back to blog
          </Link>

          <BlogCoverImage
            src={post.coverImage}
            title={post.title}
            className="mb-8 border border-[var(--border)]"
          />

          <Card className="p-8 mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="accent">
                  {tag}
                </Badge>
              ))}
              <span className="text-xs text-[var(--text-muted)] ml-auto">{post.readTime} min read</span>
            </div>
            <h1 className="font-bold text-2xl md:text-3xl text-[var(--text)] mb-3 leading-tight">
              {post.title}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </Card>

          <div className="prose-portfolio">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <BlogComments blogSlug={post.slug} />
        </motion.div>
      </div>
    </main>
  )
}
