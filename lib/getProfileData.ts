import { unstable_cache } from 'next/cache'
import connectDB from '@/lib/db'
import Profile from '@/models/Profile'

export interface ProfileDataItem {
  name: string
  tagline: string
  bio: string
  email: string
  github?: string
  linkedin?: string
  twitter?: string
  resumeUrl?: string
  profileImage?: string
  location?: string
  availableForWork: boolean
  heroTypingTexts: string[]
  projectsCount: string
  technologiesCount: string
  yearOfStudy: string
  coffeeCups: string
}

const DEFAULT_PROFILE: ProfileDataItem = {
  name: 'Aman Kumar Yadav',
  tagline: 'AI / ML Engineer building production intelligent systems',
  bio: '',
  email: '',
  github: '',
  linkedin: '',
  twitter: '',
  resumeUrl: '',
  profileImage: '',
  location: 'India',
  availableForWork: true,
  heroTypingTexts: ['AI / ML Engineer', 'Computer Vision Developer', 'Full-Stack Developer'],
  projectsCount: '0',
  technologiesCount: '0',
  yearOfStudy: '—',
  coffeeCups: '∞',
}

const getCachedProfileData = unstable_cache(
  async (): Promise<ProfileDataItem> => {
    await connectDB()
    let profile = await Profile.findOne().lean()
    if (!profile) {
      profile = await Profile.create({})
      return {
        ...DEFAULT_PROFILE,
        ...JSON.parse(JSON.stringify(profile)),
      }
    }

    return {
      ...DEFAULT_PROFILE,
      ...JSON.parse(JSON.stringify(profile)),
    }
  },
  ['profile-data'],
  { revalidate: 1800, tags: ['profile-data'] }
)

export async function getProfileData() {
  return getCachedProfileData()
}
