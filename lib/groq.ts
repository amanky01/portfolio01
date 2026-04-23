type ChatHistoryItem = { role: string; content: string }

function toOpenAiRole(role: string): 'user' | 'assistant' {
  return role === 'assistant' ? 'assistant' : 'user'
}

export async function getGroqChatResponse(options: {
  userMessage: string
  systemInstruction: string
  history?: ChatHistoryItem[]
  temperature?: number
  maxTokens?: number
}): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not set')

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
  const temperature = options.temperature ?? 0.7
  const max_tokens = options.maxTokens ?? 500
  const history = options.history ?? []

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: options.systemInstruction },
    ...history.map((h) => ({ role: toOpenAiRole(h.role), content: h.content })),
    { role: 'user', content: options.userMessage },
  ]

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
    }),
  })

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '')
    throw new Error(`Groq error ${res.status} ${res.statusText}${bodyText ? `: ${bodyText}` : ''}`)
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
    error?: unknown
  }

  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('Empty response from Groq')
  return text
}

