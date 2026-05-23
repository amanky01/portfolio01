'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import FloatingParticles from '@/components/animations/FloatingParticles'
import { FaBrain, FaRobot, FaCode, FaEye } from 'react-icons/fa'
import { useProfileData } from '@/hooks/useProfileData'
import { SectionHeader, Card, Badge, ProfileAvatar } from '@/components/ui'

interface FocusArea {
  _id?: string
  title: string
  description: string
  icon: string
  color: string
}

const ICON_MAP: Record<string, React.ReactNode> = {
  brain: <FaBrain size={20} />,
  eye: <FaEye size={20} />,
  code: <FaCode size={20} />,
  robot: <FaRobot size={20} />,
}

const FALLBACK_FOCUS: FocusArea[] = [
  { icon: 'brain', title: 'Artificial Intelligence', description: 'Deep learning, transformers, LLMs', color: 'var(--accent)' },
  { icon: 'eye', title: 'Computer Vision', description: 'YOLO, OpenCV, image segmentation', color: 'var(--magenta)' },
  { icon: 'code', title: 'Web Development', description: 'React, Next.js, Node.js, APIs', color: 'var(--success)' },
  { icon: 'robot', title: 'Robotics', description: 'ROS, Arduino, sensor fusion', color: 'var(--warning)' },
]

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { profile } = useProfileData()
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([])
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    fetch('/api/focus-areas')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFocusAreas(data)
        } else {
          setFocusAreas(FALLBACK_FOCUS)
        }
      })
      .catch(() => setFocusAreas(FALLBACK_FOCUS))
  }, [])

  const stats = [
    { label: 'Projects delivered', value: profile.projectsCount || '0' },
    { label: 'Technologies', value: profile.technologiesCount || '0' },
    { label: 'Years building', value: profile.yearOfStudy || '—' },
    { label: 'Core domains', value: profile.coffeeCups || '4+' },
  ]

  const bioParagraphs: string[] = profile.bio
    ? profile.bio.split('\n').filter(Boolean)
    : [
        'Passionate about the intersection of Artificial Intelligence, Machine Learning, and Computer Vision.',
        'Building systems that can see, learn, and decide — from training custom YOLO models to full-stack AI web apps.',
        profile.availableForWork
          ? 'Open to full-time roles, contract work, and research collaborations in AI/ML and intelligent systems.'
          : '',
      ].filter(Boolean)

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden bg-[var(--surface)]/30" ref={ref}>
      {!reduceMotion && (
        <div className="absolute inset-0 z-0 opacity-20">
          <FloatingParticles />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader eyebrow="About" title="About me" align="center" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-8"
          >
            <ProfileAvatar
              src={profile.profileImage}
              name={profile.name}
              size={208}
            />

            <div className="grid grid-cols-2 gap-3 w-full">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                >
                  <Card className="p-4 text-center" hover={false}>
                    <div className="font-bold text-2xl text-[var(--accent)] mb-1">{stat.value}</div>
                    <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              {profile.location && (
                <span className="text-sm text-[var(--text-muted)]">{profile.location}</span>
              )}
              {profile.availableForWork && <Badge variant="success">Open to work</Badge>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            <Card>
              <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
                {bioParagraphs.map((para, i) => (
                  <p key={i}>
                    {i === 0 && (
                      <>
                        Hi, I&apos;m{' '}
                        <span className="text-[var(--text)] font-medium">{profile.name}</span>
                        .{' '}
                      </>
                    )}
                    {i === 0 ? para : para}
                  </p>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {focusAreas.map((area, i) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                >
                  <Card className="p-4 h-full">
                    <div className="mb-2" style={{ color: area.color || 'var(--accent)' }}>
                      {ICON_MAP[area.icon] || <FaBrain size={20} />}
                    </div>
                    <div className="font-semibold text-sm text-[var(--text)] mb-1">{area.title}</div>
                    <div className="text-xs text-[var(--text-muted)]">{area.description}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
