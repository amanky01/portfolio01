'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa'
import type { Project } from '@/types'
import { CATEGORY_COLORS } from '@/lib/utils'
import { Badge, Button, ProjectThumbnail } from '@/components/ui'

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setProject(d.data)
        else setError(true)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)] animate-pulse">Loading project...</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-[var(--text-muted)]">Project not found</p>
        <Link href="/projects">
          <Button variant="outline">Back to projects</Button>
        </Link>
      </div>
    )
  }

  const color = CATEGORY_COLORS[project.category] ?? '#38bdf8'
  const caseStudy = project.longDescription || project.description

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] mb-8 focus-ring rounded"
          >
            <FaArrowLeft size={12} /> All projects
          </Link>

          <ProjectThumbnail
            src={project.image}
            title={project.title}
            categoryColor={color}
            className="rounded-xl mb-8"
          />

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="accent">{project.category}</Badge>
            {project.featured && <Badge variant="success">Featured</Badge>}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4 tracking-tight">
            {project.title}
          </h1>

          <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6">{project.description}</p>

          {(project.techStack?.length > 0 || project.tags?.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-8">
              {(project.techStack?.length ? project.techStack : project.tags).map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-10">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="md">
                  <FaGithub size={14} /> View code
                </Button>
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="md">
                  <FaExternalLinkAlt size={12} /> Live demo
                </Button>
              </a>
            )}
          </div>

          {caseStudy && (
            <div className="surface-card rounded-xl p-8">
              <h2 className="text-xl font-semibold text-[var(--text)] mb-6">Case study</h2>
              <div className="prose-portfolio">
                <ReactMarkdown>{caseStudy}</ReactMarkdown>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
