import { getDirectImageUrl } from '@/lib/utils'
import type { ProfileDataItem } from '@/lib/getProfileData'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amankumaryadav.dev'

export function PersonJsonLd({ profile }: { profile: ProfileDataItem }) {
  const imageUrl = getDirectImageUrl(profile.profileImage)
  const absoluteImage =
    imageUrl && imageUrl.startsWith('http') ? imageUrl : imageUrl ? `${siteUrl}${imageUrl}` : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.tagline,
    description: profile.bio || profile.tagline,
    email: profile.email || undefined,
    url: siteUrl,
    image: absoluteImage,
    sameAs: [profile.github, profile.linkedin, profile.twitter].filter(Boolean),
    address: profile.location
      ? {
          '@type': 'PostalAddress',
          addressLocality: profile.location,
        }
      : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
