'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import MatrixRain from '@/components/animations/MatrixRain'
import type { Skill } from '@/types'
import { SKILL_CATEGORY_COLORS } from '@/lib/utils'
import { SectionHeader, Card } from '@/components/ui'
import { cn } from '@/lib/utils'

function SkillBar({
  name,
  level,
  color,
  delay,
}: {
  name: string
  level: number
  color: string
  delay: number
}) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setAnimated(true), delay)
      return () => clearTimeout(t)
    }
  }, [inView, delay])

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-[var(--text)]">{name}</span>
        <span className="text-xs font-medium text-[var(--text-muted)]">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all ease-out"
          style={{
            width: animated ? `${level}%` : '0%',
            transitionDuration: '1200ms',
            background: `linear-gradient(90deg, ${color}99, ${color})`,
          }}
        />
      </div>
    </div>
  )
}

interface SkillsSectionProps {
  skills: Skill[]
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeTab, setActiveTab] = useState('')
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const first = skills[0]?.category
    if (first && !activeTab) setActiveTab(first)
  }, [skills, activeTab])

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const categories = Object.keys(grouped)
  const activeColor = SKILL_CATEGORY_COLORS[activeTab] || '#38bdf8'
  const activeSkills = grouped[activeTab] || []

  return (
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {!reduceMotion && (
        <div className="absolute inset-0 z-0">
          <MatrixRain opacity={0.04} />
        </div>
      )}
      <div className="absolute inset-0 z-[1] bg-[var(--bg)]/90" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            eyebrow="Skills"
            title="Tech stack"
            description="Technologies I work with — from neural networks to web servers"
            align="center"
          />
        </motion.div>

        {categories.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-muted)]">
            No skills added yet. Add them via the admin panel.
          </p>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap justify-center gap-2 mb-10"
            >
              {categories.map((cat) => {
                const active = activeTab === cat
                const color = SKILL_CATEGORY_COLORS[cat] || '#38bdf8'
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg border transition-all focus-ring',
                      active
                        ? 'border-[var(--accent)]/40 bg-[var(--accent-muted)] text-[var(--accent)]'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5'
                    )}
                    style={active ? { borderColor: `${color}50`, color } : undefined}
                  >
                    {cat}
                  </button>
                )
              })}
            </motion.div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="p-8">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-6 text-center">{activeTab}</h3>
                <div className="grid md:grid-cols-2 gap-x-10">
                  {activeSkills.map((skill, i) => (
                    <SkillBar
                      key={skill._id}
                      name={skill.name}
                      level={skill.level}
                      color={skill.color || activeColor}
                      delay={i * 80}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
