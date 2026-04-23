import { NextRequest, NextResponse } from 'next/server'
import { getChatResponse } from '@/lib/chat'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, history } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
      console.error('Neither GROQ_API_KEY nor GEMINI_API_KEY is set')
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact the site owner.' },
        { status: 503 }
      )
    }

    const response = await getChatResponse(message.trim(), history || [])
    return NextResponse.json({ success: true, response })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Chat API error:', msg)

    // Surface helpful errors for common Gemini issues
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service authentication failed. Please check the API key.' },
        { status: 503 }
      )
    }
    if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json(
        { error: 'AI service is temporarily unavailable (quota exceeded). Try again later.' },
        { status: 429 }
      )
    }
    if (msg.includes('model') && msg.includes('not found')) {
      return NextResponse.json(
        { error: 'AI model configuration error. Please contact the site owner.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    )
  }
}
