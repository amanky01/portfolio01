'use client'
import { useEffect, useRef } from 'react'

export default function MatrixRain({ opacity = 0.12 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let W = canvas.width = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight

    const cols = Math.floor(W / 20)
    const drops: number[] = Array(cols).fill(1)
    const chars = 'アイウエオカキクケコ0123456789ABCDEFGHIJ<>{}[]|\\/*+-='

    const draw = () => {
      ctx.fillStyle = `rgba(7,7,15,0.05)`
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = `rgba(56,189,248,${opacity})`
      ctx.font = '12px JetBrains Mono, monospace'

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * 20, y * 20)
        if (y * 20 > H && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }

    const interval = setInterval(draw, 50)
    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)
    return () => { clearInterval(interval); window.removeEventListener('resize', resize) }
  }, [opacity])

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
