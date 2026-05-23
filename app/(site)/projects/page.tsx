'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MatrixRain from '@/components/animations/MatrixRain'
import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt, FaSearch, FaArrowRight } from 'react-icons/fa'
import type { Project } from '@/types'
import { CATEGORY_COLORS } from '@/lib/utils'
import { SectionHeader, Card, Badge, ProjectThumbnail } from '@/components/ui'
import { cn } from '@/lib/utils'

const CATEGORIES = ['All', 'AI', 'ML', 'CV', 'Web', 'Robotics', 'Other']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProjects(d.data ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <main className="min-h-screen pt-20 pb-20">
      {!reduceMotion && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <MatrixRain opacity={0.04} />
          <div className="absolute inset-0 bg-[var(--bg)]/92" />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-8"
        >
          <SectionHeader
            eyebrow="Portfolio"
            title="Projects"
            description={
              loading
                ? 'Loading...'
                : `${projects.length} project${projects.length !== 1 ? 's' : ''} across AI, ML, computer vision & web development`
            }
            align="center"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          <div className="relative flex-1 max-w-sm">
            <FaSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              size={14}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-white/[0.04] text-[var(--text)] placeholder:text-[var(--text-muted)] focus-ring focus:border-[var(--accent)]/50 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat
              const color = cat === 'All' ? 'var(--accent)' : CATEGORY_COLORS[cat] || '#38bdf8'
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg border transition-all focus-ring',
                    active
                      ? 'bg-[var(--accent-muted)] border-[var(--accent)]/40 text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-white/5'
                  )}
                  style={active && cat !== 'All' ? { borderColor: `${color}50`, color } : undefined}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, i) => {
              const color = CATEGORY_COLORS[project.category] || '#38bdf8'
              return (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Card className="p-0 overflow-hidden flex flex-col h-full group">
                    <Link href={`/projects/${project._id}`}>
                      <ProjectThumbnail
                        src={project.image}
                        title={project.title}
                        categoryColor={color}
                      />
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="accent">{project.category}</Badge>
                        {project.featured && (
                          <span className="text-xs text-[var(--warning)]">Featured</span>
                        )}
                      </div>
                      <Link href={`/projects/${project._id}`}>
                        <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1 mb-3 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-auto items-center">
                        <Link
                          href={`/projects/${project._id}`}
                          className="flex items-center gap-1 text-xs text-[var(--accent)] focus-ring rounded"
                        >
                          Details <FaArrowRight size={10} />
                        </Link>
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] focus-ring rounded"
                          >
                            <FaGithub size={12} /> GitHub
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[var(--accent)] focus-ring rounded"
                          >
                            <FaExternalLinkAlt size={10} /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[var(--text-muted)]">Loading projects...</p>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <Card className="p-12 text-center">
            <p className="font-semibold text-xl text-[var(--accent)] mb-2">No projects yet</p>
            <p className="text-sm text-[var(--text-muted)]">
              Add projects via the admin panel to see them here.
            </p>
          </Card>
        )}

        {!loading && projects.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm text-[var(--text-muted)]">
              No projects matching &quot;{search}&quot; in {activeCategory}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
