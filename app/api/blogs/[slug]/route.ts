import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import mongoose from 'mongoose'
import connectDB from '@/lib/db'
import Blog from '@/models/Blog'
import { isAuthenticated } from '@/lib/auth'
import { calculateReadTime } from '@/lib/utils'

/** Admin URLs may pass MongoDB _id; public URLs use slug */
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
    const filter = blogLookupFilter(params.slug)
    const query = adminView ? filter : { ...filter, published: true }
    const blog = await Blog.findOne(query).lean()
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(
      { success: true, data: blog },
      {
        headers: {
          'Cache-Control': adminView
            ? 'private, no-store'
            : 'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    if (body.content) body.readTime = calculateReadTime(body.content)
    const blog = await Blog.findOneAndUpdate(blogLookupFilter(params.slug), body, { new: true })
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidateTag('blogs-data')
    return NextResponse.json({ success: true, data: blog })
  } catch {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, ctx: { params: { slug: string } }) {
  return PUT(req, ctx)
}

export async function POST(req: NextRequest, ctx: { params: { slug: string } }) {
  return PUT(req, ctx)
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const result = await Blog.findOneAndDelete(blogLookupFilter(params.slug))
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidateTag('blogs-data')
    return NextResponse.json({ success: true, message: 'Blog deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'GET, PUT, PATCH, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
