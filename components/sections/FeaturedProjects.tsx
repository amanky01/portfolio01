'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa'
import type { Project } from '@/types'
import { CATEGORY_COLORS } from '@/lib/utils'
import { SectionHeader, Card, Badge, Button, ProjectThumbnail } from '@/components/ui'

interface FeaturedProjectsProps {
  projects: Project[]
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects-preview" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            eyebrow="Projects"
            title="Featured projects"
            description="Selected work across AI, ML, and full-stack development"
            align="center"
          />
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-[var(--text-muted)] mb-1">No featured projects yet</p>
            <p className="text-xs text-[var(--text-muted)]">
              Add projects and mark them as featured in the admin panel
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const color = CATEGORY_COLORS[project.category] ?? '#38bdf8'
              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="p-0 overflow-hidden flex flex-col h-full group">
                    <Link href={`/projects/${project._id}`} className="block">
                      <ProjectThumbnail
                        src={project.image}
                        title={project.title}
                        categoryColor={color}
                      />
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <Badge variant="accent" className="w-fit mb-3">
                        {project.category}
                      </Badge>

                      <Link href={`/projects/${project._id}`}>
                        <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                          {project.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1 mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4 mt-auto items-center">
                        <Link
                          href={`/projects/${project._id}`}
                          className="flex items-center gap-1 text-xs text-[var(--accent)] hover:opacity-80 focus-ring rounded"
                        >
                          Case study <FaArrowRight size={10} />
                        </Link>
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors focus-ring rounded"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaGithub size={13} /> Code
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[var(--accent)] focus-ring rounded"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaExternalLinkAlt size={11} /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/projects">
            <Button variant="outline" size="lg">
              View all projects →
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
