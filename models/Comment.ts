import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IComment extends Document {
  blog: Types.ObjectId
  blogSlug: string
  blogTitle: string
  name: string
  email: string
  body: string
  approved: boolean
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true, index: true },
    blogSlug: { type: String, required: true, trim: true, index: true },
    blogTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    approved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
)

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
