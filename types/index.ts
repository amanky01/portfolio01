export interface Project {
  _id: string
  title: string
  description: string
  longDescription?: string
  tags: string[]
  category: 'AI' | 'ML' | 'Robotics' | 'Web' | 'CV' | 'Other'
  github?: string
  demo?: string
  image?: string
  featured: boolean
  techStack: string[]
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  coverImage?: string
  published: boolean
  readTime: number
  createdAt: string
  updatedAt: string
}

export interface BlogComment {
  _id: string
  blog: string
  blogSlug: string
  blogTitle: string
  name: string
  email: string
  body: string
  approved: boolean
  createdAt: string
  updatedAt: string
}

export interface Skill {
  _id: string
  name: string
  category: 'AI/ML' | 'Web Dev' | 'Robotics' | 'Computer Vision' | 'Languages' | 'Tools'
  level: number // 0-100
  icon?: string
  color?: string
}

export interface Experience {
  _id: string
  title: string
  organization: string
  type: 'Education' | 'Work' | 'Internship' | 'Project' | 'Achievement'
  startDate: string
  endDate?: string
  current: boolean
  description: string
  tags?: string[]
  location?: string
}

export interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AdminUser {
  email: string
  token: string
}
