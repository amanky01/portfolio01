import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import { getProfileData } from '@/lib/getProfileData'
import { getDirectImageUrl } from '@/lib/utils'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amankumaryadav.dev'

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileData()
  const imageUrl = getDirectImageUrl(profile.profileImage)
  const ogImage =
    imageUrl && imageUrl.startsWith('http')
      ? imageUrl
      : imageUrl
        ? `${siteUrl}${imageUrl}`
        : undefined

  return {
    title: {
      default: `${profile.name} | ${profile.tagline}`,
      template: `%s | ${profile.name}`,
    },
    description:
      profile.bio?.split('\n')[0] ||
      profile.tagline ||
      'AI, ML, and computer vision engineer building production intelligent systems.',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: profile.name,
      title: `${profile.name} | ${profile.tagline}`,
      description: profile.tagline,
      ...(ogImage ? { images: [{ url: ogImage, width: 800, height: 800, alt: profile.name }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: `${profile.name} | ${profile.tagline}`,
      description: profile.tagline,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfileData()

  return (
    <>
      <PersonJsonLd profile={profile} />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  )
}
