import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          muted: 'var(--accent-muted)',
        },
        border: 'var(--border)',
        muted: 'var(--text-muted)',
        cyber: {
          bg: 'var(--bg)',
          bg2: 'var(--bg2)',
          card: 'var(--card)',
          border: 'var(--border)',
          cyan: 'var(--accent)',
          magenta: 'var(--magenta)',
          yellow: 'var(--warning)',
          green: 'var(--success)',
          dim: 'var(--text-muted)',
          text: 'var(--text)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        orbitron: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 8px 32px rgba(0, 0, 0, 0.3)',
        glow: '0 0 0 1px rgba(56, 189, 248, 0.2), 0 8px 32px rgba(56, 189, 248, 0.08)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      backgroundImage: {
        'grid-subtle': "linear-gradient(rgba(56,189,248,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.015) 1px, transparent 1px)",
        'glow-accent': 'radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

export default config
