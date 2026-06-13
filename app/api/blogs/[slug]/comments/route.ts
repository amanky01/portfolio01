import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/db'
import Blog from '@/models/Blog'
import Comment from '@/models/Comment'
import { isAuthenticated } from '@/lib/auth'
import { sanitizeCommentInput } from '@/lib/commentValidation'

function blogLookupFilter(param: string) {
  if (mongoose.Types.ObjectId.isValid(param) && String(new mongoose.Types.ObjectId(param)) === param) {
    return { _id: param }
  }
  return { slug: param }
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const adminView = isAuthenticated(req)
    const blog = await Blog.findOne({ ...blogLookupFilter(params.slug), published: true }).select('_id slug title').lean()
    if (!blog || Array.isArray(blog)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const query = adminView
      ? { blog: blog._id }
      : { blog: blog._id, approved: true }

    const comments = await Comment.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json(
      { success: true, data: comments },
      {
        headers: {
          'Cache-Control': adminView
            ? 'private, no-store'
            : 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const blog = await Blog.findOne({ ...blogLookupFilter(params.slug), published: true }).select('_id slug title').lean()
    if (!blog || Array.isArray(blog)) return NextResponse.json({ error: 'Blog not found' }, { status: 404 })

    const raw = await req.json()
    const parsed = sanitizeCommentInput(raw)
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

    const comment = await Comment.create({
      blog: blog._id,
      blogSlug: blog.slug,
      blogTitle: blog.title,
      ...parsed.data,
      approved: false,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Comment submitted and awaiting moderation.',
        data: {
          _id: comment._id,
          name: comment.name,
          body: comment.body,
          createdAt: comment.createdAt,
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'GET, POST, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
