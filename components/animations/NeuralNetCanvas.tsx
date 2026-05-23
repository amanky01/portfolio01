'use client'
import { useEffect, useRef } from 'react'

interface Node {
  x: number; y: number; vx: number; vy: number
  radius: number; color: string; pulsePhase: number; active: boolean
}

const COLORS = ['#38bdf8', '#a78bfa', '#34d399', '#94a3b8']

export default function NeuralNetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let nodes: Node[] = []
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      initNodes()
    }

    const initNodes = () => {
      const count = Math.floor((W * H) / 12000)
      nodes = Array.from({ length: Math.min(count, 80) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        active: Math.random() > 0.7,
      }))
    }

    let t = 0
    const draw = () => {
      t += 0.01
      ctx.clearRect(0, 0, W, H)

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 160

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35
            const pulse = (Math.sin(t * 2 + a.pulsePhase) + 1) / 2

            // Signal traveling along edge
            const signalPos = (t * 0.5 + a.pulsePhase) % 1
            const sx = a.x + dx * signalPos
            const sy = a.y + dy * signalPos

            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(56,189,248,${alpha * (0.5 + pulse * 0.5)})`
            ctx.lineWidth = 0.5
            ctx.stroke()

            // Traveling signal dot
            if (dist < 120 && (a.active || b.active)) {
              ctx.beginPath()
              ctx.arc(sx, sy, 1.5, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(56,189,248,${alpha * 2})`
              ctx.fill()
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > W) node.vx *= -1
        if (node.y < 0 || node.y > H) node.vy *= -1

        const pulse = (Math.sin(t * 3 + node.pulsePhase) + 1) / 2
        const r = node.radius + pulse * 1.5
        const glow = node.active ? 0.9 : 0.5

        // Outer glow
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4)
        grad.addColorStop(0, node.color.replace(')', `,${glow})`).replace('rgb', 'rgba'))
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}
