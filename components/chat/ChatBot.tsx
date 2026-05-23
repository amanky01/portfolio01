'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaTimes, FaPaperPlane, FaMinus } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  "What's Aman's tech stack?",
  'Is Aman open to internships?',
  'Tell me about his projects',
  'What are his AI skills?',
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        "Hi! I'm **ARIA** — Aman's AI assistant. Ask me anything about his skills, projects, experience, or availability.",
      timestamp: new Date(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus()
  }, [open, minimized])

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      })

      const data = await res.json()

      const reply = res.ok
        ? (data.response ?? 'Sorry, I had trouble responding. Please try again.')
        : (data.error ?? 'An error occurred. Please try again.')

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Connection error. Please check your internet and try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const linkifyMarkdown = (text: string) =>
    text.replace(/(https?:\/\/[^\s)]+)/g, (url) => `[${url}](${url})`)

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center bg-[var(--accent)] text-[var(--bg)] shadow-glow focus-ring"
            aria-label="Open chat"
          >
            <FaRobot size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-xl overflow-hidden flex flex-col',
              'bg-[var(--surface-elevated)] border border-[var(--border)] shadow-card'
            )}
            style={{ height: minimized ? 'auto' : '480px' }}
          >
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-muted)] text-[var(--accent)]">
                  <FaRobot size={14} />
                </div>
                <div>
                  <div className="font-semibold text-sm text-[var(--text)]">ARIA</div>
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    AI assistant
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized((m) => !m)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-white/5 focus-ring"
                  aria-label="Minimize"
                >
                  <FaMinus size={10} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-white/5 focus-ring"
                  aria-label="Close chat"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                    >
                      <div
                        className={cn(
                          'w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-medium mt-0.5',
                          msg.role === 'assistant'
                            ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                            : 'bg-white/10 text-[var(--text-muted)]'
                        )}
                      >
                        {msg.role === 'assistant' ? 'A' : 'U'}
                      </div>

                      <div
                        className={cn(
                          'max-w-[78%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                          msg.role === 'assistant'
                            ? 'bg-white/[0.04] border border-[var(--border)] text-[var(--text)]'
                            : 'bg-[var(--accent-muted)] border border-[var(--accent)]/20 text-[var(--text)]'
                        )}
                      >
                        <ReactMarkdown
                          components={{
                            strong: ({ children }) => (
                              <strong className="text-[var(--accent)] font-semibold">{children}</strong>
                            ),
                            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--accent)] underline"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {linkifyMarkdown(msg.content)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-2 items-center">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-[var(--accent-muted)] text-[var(--accent)]">
                        A
                      </div>
                      <div className="flex gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-[var(--border)]">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {messages.length === 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-colors focus-ring"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <div className="px-3 py-3 flex-shrink-0 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2 rounded-lg px-3 py-2 border border-[var(--border)] bg-white/[0.04]">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Ask about Aman..."
                      disabled={loading}
                      className="flex-1 bg-transparent outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-ring"
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="text-[var(--accent)] disabled:opacity-30 transition-opacity focus-ring rounded"
                      aria-label="Send message"
                    >
                      <FaPaperPlane size={12} />
                    </button>
                  </div>
                  <p className="text-xs text-center mt-2 text-[var(--text-muted)]">Powered by Gemini AI</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
