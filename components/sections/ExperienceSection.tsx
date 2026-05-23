'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaGraduationCap, FaBriefcase, FaTrophy, FaCode, FaLaptopCode } from 'react-icons/fa'
import type { ExperienceItem } from '@/lib/getExperienceData'
import { SectionHeader, Card, Badge } from '@/components/ui'

const TYPE_COLORS: Record<string, string> = {
  Education: '#38bdf8',
  Project: '#a78bfa',
  Achievement: '#fbbf24',
  Internship: '#34d399',
  Work: '#f472b6',
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Education: <FaGraduationCap size={14} />,
  Project: <FaCode size={14} />,
  Achievement: <FaTrophy size={14} />,
  Internship: <FaBriefcase size={14} />,
  Work: <FaLaptopCode size={14} />,
}

function formatPeriod(exp: ExperienceItem): string {
  return exp.current
    ? `${exp.startDate} — Present`
    : exp.endDate
      ? `${exp.startDate} — ${exp.endDate}`
      : exp.startDate
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[]
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="experience" className="relative py-24 md:py-32 overflow-hidden bg-[var(--surface)]/30" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            eyebrow="Experience"
            title="Experience & timeline"
            description="My journey through education, projects, and achievements"
            align="center"
          />
        </motion.div>

        {experiences.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-muted)]">
            No experience entries yet. Add them via the admin panel.
          </p>
        ) : (
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[var(--border)]" />

            <div className="space-y-8">
              {experiences.map((exp, i) => {
                const isLeft = i % 2 === 0
                const color = TYPE_COLORS[exp.type] || '#38bdf8'
                const icon = TYPE_ICONS[exp.type] || <FaCode size={14} />

                return (
                  <motion.div
                    key={exp._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative flex items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                      <Card className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {exp.type}
                            </Badge>
                            <h3 className="font-semibold text-[var(--text)]">{exp.title}</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">{exp.organization}</p>
                          </div>
                          {exp.current && <Badge variant="success">Current</Badge>}
                        </div>

                        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                          {exp.description}
                        </p>

                        {exp.tags && exp.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {exp.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-[var(--text-muted)]">{formatPeriod(exp)}</p>
                      </Card>
                    </div>

                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-5 z-10">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-[var(--surface)]"
                        style={{ borderColor: color, color }}
                      >
                        {icon}
                      </div>
                    </div>

                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
