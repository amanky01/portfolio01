'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'
import type { ExperienceItem } from '@/lib/getExperienceData'
import { SectionHeader, Card, Badge } from '@/components/ui'

interface EducationSectionProps {
  education: ExperienceItem[]
}

export default function EducationSection({ education }: EducationSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="education" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <SectionHeader eyebrow="Education" title="Education" align="center" />
        </motion.div>

        {education.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center">
            No education entries available right now.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, i) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-[var(--accent-muted)] text-[var(--accent)]">
                      <FaGraduationCap size={20} />
                    </div>
                    {edu.current && <Badge variant="success">Enrolled</Badge>}
                  </div>

                  <h3 className="font-semibold text-lg text-[var(--text)] mb-1">{edu.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">{edu.organization}</p>

                  <div className="space-y-2 mb-4 text-sm text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[var(--accent)] shrink-0" size={12} />
                      <span>
                        {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                      </span>
                    </div>
                    {edu.location && (
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[var(--accent)] shrink-0" size={12} />
                        <span>{edu.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{edu.description}</p>

                  {edu.tags && edu.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {edu.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
